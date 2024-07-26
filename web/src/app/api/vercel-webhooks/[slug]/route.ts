import { NextResponse, type NextRequest } from "next/server";
import { redis } from "@/lib/db";
import { createDiscordEmbed } from "@/utils/createVercelEmbed";
import { VercelDeploymentWebhook } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const id = params.slug;

  try {
    const discordWebhookUrl = await redis.get(id);

    if (!discordWebhookUrl) {
      return NextResponse.json(
        { error: true, message: "Discord webhook URL not found" },
        { status: 404 }
      );
    }

    const webhookUrl = discordWebhookUrl as string;

    const vercelWebhookData: VercelDeploymentWebhook = await req.json();

    const discordEmbed = createDiscordEmbed(vercelWebhookData);

    const discordPayload = JSON.stringify({ embeds: [discordEmbed] });

    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: discordPayload,
    });

    if (!discordResponse.ok) {
      return NextResponse.json(
        {
          error: true,
          message:
            "Discord API responded with status " + discordResponse.status,
        },
        { status: discordResponse.status }
      );
    }

    return NextResponse.json(
      {
        error: false,
        message: "Webhook processed and sent to Discord successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: true, message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
