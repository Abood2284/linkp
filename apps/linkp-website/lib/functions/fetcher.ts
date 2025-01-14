import { APIResponse } from "@repo/db/types";
import { Fetcher } from "swr";

export const fetcher: Fetcher<any> = async (url: string) => {
  if (!url) throw new Error("URL is required");

  console.log(`Fetcher : URl: ${url} Starting`);
  try {
    const res = await fetch(url);
    console.log(`Fetcher : URl: ${url} Status: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Fetcher : URl: ${url} Error: ${errorText}`);
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    console.log(`Fetcher : URl: ${url} Data: ${data}`);
    return data as APIResponse;
  } catch (error) {
    console.error(`Fetcher : URl: ${url} Error: ${error}`);
    throw error;
  }
};
