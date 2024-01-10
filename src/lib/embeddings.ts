import { OpenAIApi, Configuration } from "openai-edge";
import { env } from "~/env";

const config = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await response.json();
    console.log("result:", result);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return result?.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embedding api", error);
    throw error;
  }
}
