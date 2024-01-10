import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "~/env";

let pinecone: Pinecone | null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      environment: env.PINECONE_ENIVIRONMENT,
      apiKey: env.PINECONE_API_KEY,
    });
  }

  return pinecone;
};
