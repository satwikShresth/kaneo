import {
  anonymousClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    anonymousClient(),
    organizationClient({
      teams: {
        enabled: false,
      },
      schema: {
        organization: {
          additionalFields: {
            description: {
              type: "string",
              input: true,
              required: false,
            },
          },
        },
        member: {
          additionalFields: {
            status: {
              type: "string",
              input: true,
              required: false,
            },
          },
        },
      },
    }),
  ],
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:1337",
});

export { client } from "./hono";
