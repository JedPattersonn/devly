import { VercelDeploymentWebhook } from "@/lib/types";

export function createDiscordEmbed(webhook: VercelDeploymentWebhook) {
  try {
    const { type, payload, createdAt } = webhook;
    if (!payload) throw new Error("Webhook payload is undefined");

    const { deployment, project, target, alias, regions, user } = payload;
    if (!deployment) throw new Error("Deployment information is missing");
    if (!project) throw new Error("Project information is missing");
    if (!user) throw new Error("User information is missing");

    let color: number;
    let title: string;
    let description: string;

    switch (type) {
      case "deployment.created":
        color = 0xffa500;
        title = "Deployment Created";
        description = `A new deployment has been initiated for project ${project.id || "Unknown"}`;
        break;
      case "deployment.succeeded":
        color = 0x00ff00;
        title = "Deployment Succeeded";
        description = `Deployment for project ${project.id || "Unknown"} has completed successfully`;
        break;
      case "deployment.ready":
        color = 0x0000ff;
        title = "Deployment Ready";
        description = `Deployment for project ${project.id || "Unknown"} is now ready`;
        break;
      case "deployment.promoted":
        color = 0x800080;
        title = "Deployment Promoted";
        description = `A deployment for project ${project.id || "Unknown"} has been promoted`;
        break;
      case "deployment.canceled":
        color = 0xffff00;
        title = "Deployment Canceled";
        description = `Deployment for project ${project.id || "Unknown"} has been canceled`;
        break;
      case "deployment.error":
        color = 0xff0000;
        title = "Deployment Error";
        description = `An error occurred during deployment for project ${project.id || "Unknown"}`;
        break;
      default:
        color = 0x808080;
        title = "Unknown Event";
        description = `An unknown event occurred for project ${project.id || "Unknown"}`;
    }

    const embed = {
      color: color,
      title: `${title}: ${deployment.name || "Unnamed"}`.substring(0, 256),
      url: deployment.url ? `https://${deployment.url}` : "",
      description: description.substring(0, 2048),
      fields: [
        {
          name: "Deployment ID",
          value: deployment.id || "Unknown",
          inline: true,
        },
        { name: "Environment", value: target || "Not specified", inline: true },
        {
          name: "Event Time",
          value: `<t:${Math.floor(createdAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Regions",
          value:
            Array.isArray(regions) && regions.length > 0
              ? regions.join(", ").substring(0, 1024)
              : "Not specified",
          inline: true,
        },
        {
          name: "Alias",
          value:
            Array.isArray(alias) && alias.length > 0
              ? alias.join(", ").substring(0, 1024)
              : "None",
          inline: true,
        },
      ],
      footer: {
        text: `Deployed by User ID: ${user.id || "Unknown"} | created by devly.dev`.substring(
          0,
          2048
        ),
      },
      timestamp: new Date(createdAt).toISOString(),
    };

    if (deployment.meta) {
      if (deployment.meta.githubCommitAuthorName) {
        embed.fields.push({
          name: "Author",
          value: deployment.meta.githubCommitAuthorName.substring(0, 1024),
          inline: true,
        });
      }

      if (deployment.meta.githubCommitMessage) {
        embed.fields.push({
          name: "Commit Message",
          value: deployment.meta.githubCommitMessage.substring(0, 1024),
          inline: false,
        });
      }

      if (deployment.meta.githubCommitRef) {
        embed.fields.push({
          name: "Branch",
          value: deployment.meta.githubCommitRef.substring(0, 1024),
          inline: true,
        });
      }
    }

    return embed;
  } catch (error) {
    console.error("Error creating Discord embed:", error);
    return {
      color: 0xff0000,
      title: "Error Creating Embed",
      description:
        `An error occurred while creating the embed: ${(error as Error).message}`.substring(
          0,
          2048
        ),
      timestamp: new Date().toISOString(),
    };
  }
}
