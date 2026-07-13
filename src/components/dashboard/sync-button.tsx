"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { triggerTikTokSync } from "@/actions/sync";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSync = () => {
    startTransition(async () => {
      try {
        const result = await triggerTikTokSync();
        alert(`Sincronização concluída! ${result.count} vídeos novos encontrados.`);
        router.refresh(); // Refresh para puxar dados novos, embora revalidatePath já tenha sido chamado
      } catch (error: any) {
        alert(error.message || "Ocorreu um erro na sincronização.");
      }
    });
  };

  return (
    <Button onClick={handleSync} disabled={isPending} className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="mr-2 h-4 w-4" />
      )}
      {isPending ? "Sincronizando..." : "Sincronizar Agora"}
    </Button>
  );
}
