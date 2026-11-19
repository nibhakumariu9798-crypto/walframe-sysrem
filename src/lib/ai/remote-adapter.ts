import {
  AIAdapter,
  HealthRiskInput,
  HealthRiskResult,
  ResourceForecastInput,
  ResourceForecastResult,
} from "./types";
import { DemoAIAdapter } from "./demo-adapter";

export class RemoteAIAdapter implements AIAdapter {
  private serviceUrl: string;
  private fallbackAdapter: DemoAIAdapter;

  constructor(serviceUrl?: string) {
    this.serviceUrl =
      serviceUrl ||
      process.env.NEXT_PUBLIC_AI_SERVICE_URL ||
      process.env.AI_SERVICE_URL ||
      "http://127.0.0.1:8000";
    this.fallbackAdapter = new DemoAIAdapter();
  }

  async forecastResource(
    input: ResourceForecastInput
  ): Promise<ResourceForecastResult[]> {
    try {
      const response = await fetch(`${this.serviceUrl}/predict/resource-demand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Remote AI service returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return data as ResourceForecastResult[];
    } catch (err) {
      console.warn(
        "Remote AI service unreachable. Falling back safely to verified baseline demo adapter:",
        err
      );
      return this.fallbackAdapter.forecastResource(input);
    }
  }

  async classifyHealthRisk(input: HealthRiskInput): Promise<HealthRiskResult> {
    try {
      const response = await fetch(`${this.serviceUrl}/predict/health-risk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Remote AI service returned HTTP ${response.status}`);
      }

      const data = await response.json();
      return data as HealthRiskResult;
    } catch (err) {
      console.warn(
        "Remote AI service unreachable. Falling back safely to verified baseline demo adapter:",
        err
      );
      return this.fallbackAdapter.classifyHealthRisk(input);
    }
  }
}
