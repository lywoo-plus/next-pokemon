import { drizzle } from "drizzle-orm/neon-serverless";

// Vercel injects POSTGRES_URL automatically when connected to Neon
export const db = drizzle(process.env.POSTGRES_URL!);
