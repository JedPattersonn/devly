export interface VercelWebhook<T> {
  type:
    | "deployment.created"
    | "deployment.succeeded"
    | "deployment.ready"
    | "deployment.promoted"
    | "deployment.canceled"
    | "deployment.error";
  id: string;
  createdAt: number;
  region: string | null;
  payload: T;
}

export interface VercelDeploymentBody {
  team: {
    id: string[] | null;
  };
  user: {
    id: string;
  };
  alias: string[];
  deployment: {
    id: string;
    meta: { [key: string]: string };
    url: string;
    name: string;
  };
  links: {
    deployment: string;
    project: string;
  };
  target: "production" | "staging" | null;
  project: {
    id: string;
  };
  plan: string;
  regions: string[];
}

export type VercelDeploymentWebhook = VercelWebhook<VercelDeploymentBody>;
