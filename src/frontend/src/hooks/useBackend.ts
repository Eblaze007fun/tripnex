import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";
import { createActor } from "../backend";

// Resolve canister ID: prefer the Vite build-time env var injected by
// vite-plugin-environment, fall back to the runtime window.__ENV__ object
// populated from env.json (which the Caffeine platform writes at deploy time).
const CANISTER_ID: string =
  (import.meta.env as Record<string, string>).CANISTER_ID_BACKEND ||
  (window as unknown as { __ENV__?: { backend_canister_id?: string } }).__ENV__
    ?.backend_canister_id ||
  "";

export function useBackend() {
  const { identity } = useInternetIdentity();

  const backend = useMemo(() => {
    if (!identity) return null;

    const noopUpload = async () => new Uint8Array();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const noopDownload = async (_file: Uint8Array): Promise<any> => ({
      _blob: undefined,
      directURL: "",
      getBytes: async () => new Uint8Array(),
      getDirectURL: () => "",
      withUploadProgress: function () {
        return this;
      },
    });

    return createActor(CANISTER_ID, noopUpload, noopDownload, {
      agentOptions: { identity },
    });
  }, [identity]);

  return { backend };
}
