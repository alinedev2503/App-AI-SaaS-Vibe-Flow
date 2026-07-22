import { logger } from "./logger";

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export const tools: Record<string, Tool> = {
  search_crm: {
    name: "search_crm",
    description: "Search for customer records in the CRM",
    parameters: {
      query: { type: "string", description: "Search query (name, email, company)" }
    },
    execute: async ({ query }) => {
      logger.info("mcp", `Searching CRM for: ${query}`);
      return {
        results: [
          { id: "C-101", name: "Acme Corp", status: "Active", value: "$50k" },
          { id: "C-102", name: "TechStart Inc", status: "Pending", value: "$12k" }
        ]
      };
    }
  },
  send_email: {
    name: "send_email",
    description: "Send an email to a recipient",
    parameters: {
      to: { type: "string", description: "Recipient email" },
      subject: { type: "string", description: "Email subject" },
      body: { type: "string", description: "Email body" }
    },
    execute: async ({ to, subject }) => {
      logger.info("mcp", `Sending email to ${to}: ${subject}`);
      return { status: "sent", messageId: `msg_${Date.now()}` };
    }
  }
};

export async function executeTool(toolName: string, params: any) {
  const tool = tools[toolName];
  if (!tool) {
    throw new Error(`Tool ${toolName} not found`);
  }
  return await tool.execute(params);
}
