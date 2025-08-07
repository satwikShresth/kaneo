import {
  anonymousClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [anonymousClient(), organizationClient()],
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:1337",
});

export { client } from "./hono";
