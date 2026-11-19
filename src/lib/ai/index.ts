import { AIAdapter } from "./types";
import { DemoAIAdapter } from "./demo-adapter";
import { RemoteAIAdapter } from "./remote-adapter";

let adapterInstance: AIAdapter | null = null;

export function getAIAdapter(): AIAdapter {
  if (!adapterInstance) {
    const mode = process.env.NEXT_PUBLIC_AI_ADAPTER_MODE || "demo";
    if (mode === "remote") {
      adapterInstance = new RemoteAIAdapter();
    } else {
      adapterInstance = new DemoAIAdapter();
    }
  }
  return adapterInstance;
}

export * from "./types";
export * from "./demo-adapter";
export * from "./remote-adapter";
