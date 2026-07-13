"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteVideoAction } from "@/actions/delete-video";

export function DeleteButton({ videoId }: { videoId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteVideoAction(videoId);
      } catch (error: any) {
        alert(error.message || "Erro ao excluir o vídeo.");
      }
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={isPending}
      className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
      title="Excluir vídeo"
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  );
}
