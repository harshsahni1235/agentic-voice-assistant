import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const s3 = new S3Client({
  region: "ap-south-1"
//   region: process.env.AWS_REGION
});

export async function upload() {

    try {
        
        const file = fs.readFileSync("./output.mp3");      
      
        await s3.send(new PutObjectCommand({
          Bucket: "ava-ai-storage"!,
        //   Bucket: process.env.AWS_BUCKET_NAME!,
          Key: "output.mp3",
          Body: file
        }));
      
        console.log("Uploaded successfully!");
        return { success: true, message: "Uploaded successfully!" };
    } catch (error: any) {
        console.error("Error uploading file:", error);
        return { success: false, message: error.message };
    }
}
