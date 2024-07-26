import { NextResponse, type NextRequest } from "next/server";
import { redis } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    const id = uuidv4();

    if (!url || !url.startsWith("https://discord.com/api/webhooks/")) {
      return NextResponse.json(
        { message: "Invalid Discord webhook URL", error: true },
        { status: 400 }
      );
    }

    await redis.set(id, url);

    const generatedUrl = `https://www.devly.dev/api/vercel-webhooks/${id}`;

    return NextResponse.json({
      error: false,
      url: generatedUrl,
      message: "Webhook URL generated",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: true, message: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const discordWebhookUrl = await redis.get(id);

    if (!discordWebhookUrl) {
      return NextResponse.json(
        { error: true, message: "Webhook URL not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: false,
        url: discordWebhookUrl,
        message: "Webhook URL found",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: true, message: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const { url } = await req.json();

    if (!url || !url.startsWith("https://discord.com/api/webhooks/")) {
      return NextResponse.json(
        { error: true, message: "Invalid Discord webhook URL" },
        { status: 400 }
      );
    }

    const exists = await redis.exists(id);

    if (!exists) {
      return NextResponse.json(
        { error: true, message: "Webhook ID not found" },
        { status: 404 }
      );
    }

    await redis.set(id, url);

    return NextResponse.json(
      { error: false, message: "Webhook URL updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating webhook URL:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: true, message: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const exists = await redis.exists(id);

    if (!exists) {
      return NextResponse.json(
        { error: true, message: "Webhook ID not found" },
        { status: 404 }
      );
    }

    await redis.del(id);

    return NextResponse.json(
      { error: false, message: "Webhook URL deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting webhook URL:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}
