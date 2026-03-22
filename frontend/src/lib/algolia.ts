// src/lib/algolia.ts
import { algoliasearch } from "algoliasearch";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || "";

// Read-only client safe for the frontend
export const searchClient = algoliasearch(appId, searchKey);
