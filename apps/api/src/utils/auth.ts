import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, openAPI, organization } from "better-auth/plugins";
import db from "../database";
import { publishEvent } from "../events";
import { generateDemoName } from "./generate-demo-name";

export const auth = betterAuth({
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({ data: { ...user, id: createId() } }),
      },
    },
  },
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [
    anonymous({
      generateName: async () => generateDemoName(),
    }),
    organization({
      organizationCreation: {
        disabled: false,
        afterCreate: async ({ organization, user }) => {
          publishEvent("workspace.created", {
            workspaceId: organization.id,
            workspaceName: organization.name,
            ownerEmail: user.name,
          });
        },
      },
      teams: {
        enabled: false,
      },
      schema: {
        organization: {
          modelName: "workspace",
          additionalFields: {
            description: {
              type: "string",
              input: true,
              required: false,
            },
          },
        },
        member: {
          modelName: "workspace_member",
          fields: {
            organizationId: "workspace_id",
            createdAt: "joined_at",
          },
          additionalFields: {
            status: {
              type: "string",
              input: true,
              required: false,
            },
          },
        },
        invitation: {
          modelName: "invitation",
          fields: {
            organizationId: "workspace_id",
          },
        },
      },
    }),
    openAPI(),
  ],
});
