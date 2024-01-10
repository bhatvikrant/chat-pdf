import {
  Pinecone,
  type PineconeRecord,
  utils as PineconeUtils,
} from "@pinecone-database/pinecone";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { env } from "~/env";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToASCII } from "./utils";

let pinecone: Pinecone | null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      environment: env.PINECONE_ENVIRONMENT,
      apiKey: env.PINECONE_API_KEY,
    });
  }

  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. download and read the PDF from s3
  console.log("1. downloading from s3 into file system...");
  const file_name = await downloadFromS3(fileKey);

  if (!file_name) {
    throw new Error("Could not download file from s3");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the PDF into into smaller documents
  console.log("2. segmenting PDF into smaller chunks...");
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  console.log("3. vectorising and embedding documents...");
  // TODO: for circumventing openai 3RPM ratelimit - break documents into chunks of 3 and run only 3 at a time in a timespan of 1 minute

  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload the vectors to pinecone
  console.log("4. uploading vectors to pinecone...");
  const client = await getPineconeClient();
  const pineconeIndex = client.Index("chat-pdf");

  const namespace = convertToASCII(fileKey);

  // void PineconeUtils.chunkedUpsert(pineconeIndex, vectors, namespace, 10);
  void pineconeIndex.upsert(vectors);

  return documents[0];
}

function truncateStringByBytes(str: string, maxBytes: number) {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(
    encoder.encode(str).slice(0, maxBytes),
  );
}

async function prepareDocument(page: PDFPage) {
  let { pageContent } = page;
  pageContent = pageContent.replace(/\n/, " ");

  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        text: truncateStringByBytes(pageContent, 36000), // pinecone only accepts a max of 36000 bytes
        pageNumber: page.metadata.loc.pageNumber,
      },
    }),
  ]);

  return docs;
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}
