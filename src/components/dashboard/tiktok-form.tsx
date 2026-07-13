"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateTiktokUsername } from "@/actions/settings";
import { Loader2, Check } from "lucide-react";

export function TikTokForm({ initialUsername }: { initialUsername?: string | null }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateTiktokUsername(formData);
        // Num ambiente real de SaaS Premium, aqui adicionaríamos um toast do sonner
        alert("Nome de usuário salvo com sucesso!");
      } catch (error: any) {
        alert(error.message || "Ocorreu um erro ao salvar.");
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <Card className="border-white/5 bg-[#121214]">
        <CardHeader>
          <CardTitle>TikTok</CardTitle>
          <CardDescription>Configure a conta de origem dos vídeos a serem sincronizados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tiktokUsername">Nome de Usuário (@)</Label>
            <Input 
              id="tiktokUsername" 
              name="tiktokUsername" 
              defaultValue={initialUsername || ""} 
              placeholder="@seuusuario" 
              className="bg-black/20 border-white/10 focus-visible:ring-primary/50"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-white/5 pt-4">
          <Button type="submit" disabled={isPending} className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            {isPending ? "Salvando..." : "Salvar TikTok"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
