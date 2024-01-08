"use client";

import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });
  return (
    <div className="mx-auto h-32 max-w-xl rounded-xl bg-white p-2">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col h-full",
        })}
      >
        <input {...getInputProps()} />

        <Upload className="h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-slate-400">
          Drop your PDF here to get started
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
