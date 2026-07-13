"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateInstagramUsername, updateInstagramCredentials } from "@/actions/settings";
import { Loader2, Check, Link as LinkIcon, Key, User, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

export function InstagramForm({ 
  initialUsername, 
  initialAccountId, 
  initialAccessToken,
  tokenExpiresAt
}: { 
  initialUsername?: string | null;
  initialAccountId?: string | null;
  initialAccessToken?: string | null;
  tokenExpiresAt?: Date | null;
}) {
  const [isPending, startTransition] = useTransition();

  const getDaysRemaining = () => {
    if (!tokenExpiresAt) return null;
    const diffTime = new Date(tokenExpiresAt).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  const handleUsernameSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateInstagramUsername(formData);
        toast.success("Conta do Instagram conectada com sucesso!");
      } catch (error: any) {
        toast.error(error.message || "Ocorreu um erro ao salvar.");
      }
    });
  };

  const handleCredentialsSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateInstagramCredentials(formData);
        toast.success("Credenciais da API salvas com sucesso!");
      } catch (error: any) {
        toast.error(error.message || "Ocorreu um erro ao salvar.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <form action={handleUsernameSubmit}>
        <Card className="border-[var(--border)] bg-[var(--card)]">
          <CardHeader>
            <CardTitle className="font-heading">Instagram Reels</CardTitle>
            <CardDescription>Conecte a conta de destino para a postagem automática.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagramUsername">Conta do Instagram (@)</Label>
              <div className="flex gap-2">
                <Input 
                  id="instagramUsername" 
                  name="instagramUsername" 
                  defaultValue={initialUsername || ""} 
                  placeholder="@seureels" 
                  className="bg-[var(--input)] border-[var(--border)] focus-visible:ring-primary/50"
                />
                <Button type="submit" disabled={isPending} variant={initialUsername ? "outline" : "default"} className={initialUsername ? "border-[var(--border)]" : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (initialUsername ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />)}
                  <span className="ml-2">{initialUsername ? "Salvo" : "Conectar"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      <form action={handleCredentialsSubmit}>
        <Card className="border-[var(--border)] bg-[var(--card)]">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Credenciais da API (Meta)
            </CardTitle>
            <CardDescription>Insira seu Token de Longa Duração e o ID da Conta do Instagram.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountId">Instagram Account ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="accountId" 
                  name="accountId" 
                  defaultValue={initialAccountId || ""} 
                  placeholder="Ex: 17841400000000000" 
                  className="pl-9 bg-[var(--input)] border-[var(--border)] focus-visible:ring-primary/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessToken">Access Token (60 dias)</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="accessToken" 
                  name="accessToken" 
                  type="password"
                  defaultValue={initialAccessToken || ""} 
                  placeholder="EAAGm0PX4ZC..." 
                  className="pl-9 bg-[var(--input)] border-[var(--border)] focus-visible:ring-primary/50"
                />
              </div>
            </div>

            {daysRemaining !== null && (
              <div className={`mt-2 p-3 border rounded-md flex items-start gap-2 text-sm ${daysRemaining <= 7 ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-green-500/10 border-green-500/20 text-green-600'}`}>
                {daysRemaining <= 7 ? <AlertTriangle className="h-4 w-4 mt-0.5" /> : <Clock className="h-4 w-4 mt-0.5" />}
                <div>
                  <p className="font-medium">
                    {daysRemaining > 0 
                      ? `Seu token expira em ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'}` 
                      : 'Seu token expirou!'}
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">
                    Gere um novo token no Meta for Developers e salve aqui.
                  </p>
                </div>
              </div>
            )}

            {/* Guia de Ajuda */}
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-sm text-primary mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Como obter essas credenciais?
              </h4>
              <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Acesse o <strong>Meta for Developers</strong> e crie um App (Tipo: Empresa).</li>
                <li>Adicione o produto <strong>Instagram Graph API</strong> e vincule seu Facebook.</li>
                <li>No <strong>Graph API Explorer</strong>, gere um token de permissão (pages_show_list, instagram_basic, instagram_content_publish).</li>
                <li>Gere o Token de Longa Duração trocando o token curto na API oauth da Meta.</li>
                <li>Seu <strong>Account ID</strong> pode ser obtido chamando <code className="bg-black/30 px-1 py-0.5 rounded text-[10px]">me/accounts?fields=instagram_business_account</code> no Explorer.</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="bg-white/[0.02] border-t border-[var(--border)] pt-4">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
              Salvar Credenciais Seguras
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
