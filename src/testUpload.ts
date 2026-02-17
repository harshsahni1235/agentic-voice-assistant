import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "ap-south-1"
//   region: process.env.AWS_REGION
});


// const s3 = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: "accessKeyId",
//     secretAccessKey: "secretAccessKey"
//   }
// });

const command = new GetObjectCommand({
  Bucket: "ava-ai-storage",
  Key: "output.mp3"
});




export async function upload(): Promise<{ success: boolean; signedUrl?: string; message: string }> {

    try {
        
        const file = fs.readFileSync("./output.mp3");      
      
        await s3.send(new PutObjectCommand({
          Bucket: "ava-ai-storage",
        //   Bucket: process.env.AWS_BUCKET_NAME!,
          Key: "output.mp3",
          Body: file
        }));
      
        console.log("Uploaded successfully!");
        
        const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 3600
        });

        console.log("Signed URL:", signedUrl);


        return { success: true, signedUrl: signedUrl, message: "Uploaded successfully!" };
    } catch (error: any) {
        console.error("Error uploading file:", error);
        return { success: false, message: error.message };
    }
}
