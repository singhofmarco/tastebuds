import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs"
import prisma from "@/app/lib/prisma";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region: process.env.AWS_REGION,
});

/**
 * This route is called by QSTASH to upload the generated image to S3
 * and update the recipe with the image URL
 */
async function handler(_req: NextRequest) {
  const data = await _req.json()


  const body = data.body
  const sourceMessageId = data.sourceMessageId
  const decodedBody = JSON.parse(atob(body)).data[0].url

  try {
      // download image from url and convert to buffer
  const response = await fetch(decodedBody);
  const buffer = await response.arrayBuffer();
    // compress image
    const compressedImage = await sharp(buffer)
      .jpeg({ mozjpeg: true })
      .toBuffer();

    // upload image to S3 bucket
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_REGION) {
      throw new Error("AWS bucket config is not set");
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = uuidv4() + ".jpeg";

    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Body: compressedImage,
      Key: key,
      ContentType: "image/jpeg",
      ACL: "public-read",
    };

    await s3Client.send(new PutObjectCommand(params));

    const url = `https://${bucketName}.s3.amazonaws.com/${key}`;

    // update recipe with image URL
    await prisma.recipe.updateMany({
      where: {
        qStashMessageId: sourceMessageId,
      },
      data: {
        image: url,
        qStashMessageId: null,
      },
    });

    revalidatePath("/recipes");
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.log("Failed to upload image", error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const POST = verifySignatureAppRouter(handler);
// export const runtime = "edge";