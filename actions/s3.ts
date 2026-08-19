'use server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucket = process.env.AWS_S3_BUCKET;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

function requireS3Config() {
  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing AWS S3 environment variables');
  }

  return { accessKeyId, bucket, region, secretAccessKey };
}

function createSafeFileName(fileName: string) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createPresignedS3UploadUrl(input: {
  fileName: string;
  fileType: string;
}) {
  if (!input.fileType.startsWith('image/')) {
    throw new Error('Only image uploads are allowed');
  }

  const { accessKeyId, bucket, region, secretAccessKey } = requireS3Config();
  const safeFileName = createSafeFileName(input.fileName) || 'image';
  const key = `pokemon/${crypto.randomUUID()}-${safeFileName}`;
  const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: input.fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return {
    key,
    uploadUrl,
    publicUrl,
  };
}
