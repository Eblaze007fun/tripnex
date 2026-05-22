import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { backend } = useBackend();

  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<"configured" | "none" | "loading">(
    "loading",
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing key status on mount
  useEffect(() => {
    if (!backend || !isAuthenticated) return;
    void (async () => {
      try {
        const key = await (
          backend as unknown as {
            getAviationstackApiKey: () => Promise<string | null>;
          }
        ).getAviationstackApiKey();
        setKeyStatus(key ? "configured" : "none");
      } catch {
        setKeyStatus("none");
      }
    })();
  }, [backend, isAuthenticated]);

  async function handleSave() {
    if (!backend || !apiKey.trim()) return;
    setSaving(true);
    try {
      await (
        backend as unknown as {
          setAviationstackApiKey: (k: string) => Promise<void>;
        }
      ).setAviationstackApiKey(apiKey.trim());
      setKeyStatus("configured");
      setSaved(true);
      setApiKey("");
      setTimeout(() => setSaved(false), 4000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center"
          data-ocid="admin.login_prompt"
        >
          <div className="w-20 h-20 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground max-w-sm mb-8">
            Sign in with Internet Identity to access admin settings.
          </p>
          <Button
            size="lg"
            onClick={login}
            className="gap-2 font-semibold"
            data-ocid="admin.login_button"
          >
            <Lock className="w-4 h-4" />
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
          data-ocid="admin.page"
        >
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            data-ocid="admin.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center">
              <Settings className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                API Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure external data sources for live flight search
              </p>
            </div>
          </div>
        </motion.div>

        {/* Aviationstack Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-card border border-border/60 overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40" />
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Key className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      Aviationstack API Key
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Required for real-time flight data
                    </p>
                  </div>
                </div>
                {keyStatus === "loading" ? (
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                ) : keyStatus === "configured" ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs"
                    data-ocid="admin.key_configured_badge"
                  >
                    Key configured
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground border-border text-xs"
                    data-ocid="admin.key_none_badge"
                  >
                    No key set
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="aviationstack-key"
                  className="text-sm font-medium text-foreground"
                >
                  API Key
                </Label>
                <div className="relative">
                  <Input
                    id="aviationstack-key"
                    type={showKey ? "text" : "password"}
                    placeholder={
                      keyStatus === "configured"
                        ? "Enter new key to replace existing"
                        : "Enter your Aviationstack API key"
                    }
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pr-10 font-mono bg-background border-input"
                    data-ocid="admin.api_key_input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showKey ? "Hide key" : "Show key"}
                    data-ocid="admin.toggle_visibility_button"
                  >
                    {showKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your key at{" "}
                  <a
                    href="https://aviationstack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline"
                  >
                    aviationstack.com
                  </a>
                  . Free tier supports 100 requests/month.
                </p>
              </div>

              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5"
                  data-ocid="admin.success_state"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  API key saved successfully. Live flight search is now enabled.
                </motion.div>
              )}

              <Button
                onClick={handleSave}
                disabled={!apiKey.trim() || saving}
                className="w-full font-semibold gap-2"
                data-ocid="admin.save_button"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Save API Key
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-muted-foreground text-center mt-6"
        >
          Keys are stored securely in the TRIPNEX canister. Only authenticated
          admins can view or update this setting.
        </motion.p>
      </div>
    </Layout>
  );
}
