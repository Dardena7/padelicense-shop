"use client";

import { useState, useCallback } from "react";
import SparkMD5 from "spark-md5";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/graphql", "") ||
  "http://localhost:3000";

const computeChecksum = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(e.target?.result as ArrayBuffer);
      const md5 = spark.end(true); // raw binary
      resolve(btoa(md5));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

export const useDirectUpload = () => {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File): Promise<string> => {
    setUploading(true);

    try {
      const checksum = await computeChecksum(file);

      // Step 1: Create blob record on Rails
      const createResponse = await fetch(
        `${API_URL}/rails/active_storage/direct_uploads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            blob: {
              filename: file.name,
              content_type: file.type,
              byte_size: file.size,
              checksum,
            },
          }),
        },
      );

      if (!createResponse.ok) {
        throw new Error("Failed to create upload");
      }

      const blob = await createResponse.json();

      // Step 2: Upload file to the storage URL
      const uploadResponse = await fetch(blob.direct_upload.url, {
        method: "PUT",
        headers: blob.direct_upload.headers,
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      return blob.signed_id;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading };
};
