"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { uploadToS3 } from "~/lib/s3";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);

      const file = acceptedFiles[0];

      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size must be less than 10MB");
          return;
        } else {
          try {
            setUploading(true);
            const data = await uploadToS3(file);
            console.log("data:", data);

            if (data) {
              if (!data.file_key || !data.file_name) {
                toast.error("Something went wrong");
                return;
              }
              mutate(data, {
                onSuccess: ({ chat_id }) => {
                  toast.success("Chat created");
                  router.push(`/chat/${chat_id}`);
                },
                onError: (error) => {
                  console.log("error:", error);
                  toast.error("Error creating chat");
                },
              });
            }
          } catch (error) {
            console.log("error:", error);
          } finally {
            setUploading(false);
          }
        }
      }
    },
  });
  return (
    <div className="mx-auto min-h-32 max-w-xl rounded-xl bg-white p-2">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col h-full",
        })}
      >
        <input {...getInputProps()} />

        {uploading || isPending ? (
          <>
            <Loader2 className="h-10 w-10 shrink-0 animate-spin text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Working the AI magic...
            </p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 shrink-0 text-gray-400" />
            <p className="mt-2 text-sm text-slate-400">
              Drop your PDF here to get started
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
