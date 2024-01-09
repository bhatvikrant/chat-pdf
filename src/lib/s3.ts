import AWS from "aws-sdk";
import { env } from "~/env";

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      },
      region: "ap-south-1",
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replaceAll(" ", "-");

    const params = {
      Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: file_key,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        console.log(
          "uploading to s3...",
          parseInt(((evt.loaded * 100) / evt.total).toString()) + "%",
        );
      })
      .promise();

    await upload.then((data) => {
      console.log("successfully uploaded to s3", { data, file_key });
    });

    return Promise.resolve({ file_key, file_name: file.name });
  } catch (error) {}
}

export function getS3Url(file_key: string) {
  return `https://${env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
}
