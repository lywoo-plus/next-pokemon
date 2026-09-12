'use server';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
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

function createS3Client() {
  const { accessKeyId, region, secretAccessKey } = requireS3Config();

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function getS3KeyFromPublicUrl(publicUrl: string) {
  const { bucket, region } = requireS3Config();
  const url = new URL(publicUrl);
  const expectedHost = `${bucket}.s3.${region}.amazonaws.com`;

  if (url.hostname !== expectedHost) {
    throw new Error('Invalid S3 image URL');
  }

  return decodeURIComponent(url.pathname.replace(/^\/+/, ''));
}

export async function createPresignedS3UploadUrl(input: {
  fileName: string;
  fileType: string;
}) {
  if (!input.fileType.startsWith('image/')) {
    throw new Error('Only image uploads are allowed');
  }

  const { bucket, region } = requireS3Config();
  const safeFileName = createSafeFileName(input.fileName) || 'image';
  const key = `pokemon/${crypto.randomUUID()}-${safeFileName}`;
  const s3 = createS3Client();

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

export async function deleteS3ObjectByPublicUrl(publicUrl: string) {
  const { bucket } = requireS3Config();
  const key = getS3KeyFromPublicUrl(publicUrl);
  const s3 = createS3Client();

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
