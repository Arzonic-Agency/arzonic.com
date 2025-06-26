import path from "path";

export const CONTENT_PATH = process.env.CONTENT_PATH?.startsWith("/")
  ? process.env.CONTENT_PATH
  : path.resolve(process.cwd(), process.env.CONTENT_PATH || "./localess");
