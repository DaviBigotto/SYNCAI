import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TikTokForm } from "@/components/dashboard/tiktok-form";
import { InstagramForm } from "@/components/dashboard/instagram-form";
import { getSettings } from "@/actions/settings";

export default async function SettingsPage() {
  const settings = await getSettings().catch(() => null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h3 className="text-2xl font-bold tracking-tight font-heading">Configurações</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas contas de redes sociais e credenciais de API.
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <TikTokForm initialUsername={settings?.tiktokUsername} />

        <InstagramForm 
          initialUsername={settings?.instagramUsername} 
          initialAccountId={settings?.instagramAccountId}
          initialAccessToken={settings?.instagramAccessToken}
          tokenExpiresAt={(settings as any)?.instagramTokenExpiresAt}
        />
      </div>
    </div>
  );
}
