"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PublishButtonProps {
  videoId: string;
}

export function PublishButton({ videoId }: PublishButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [statusText, setStatusText] = useState("");
  const router = useRouter();

  const handlePublish = () => {
    if (!confirm("Tem certeza que deseja enviar este vídeo para o Instagram Reels agora?")) {
      return;
    }

    setIsPending(true);
    setStatusText("Iniciando...");

    const eventSource = new EventSource(`/api/publish/sse?videoId=${videoId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.status) {
          setStatusText(data.status);
        }

        if (data.done) {
          eventSource.close();
          setIsPending(false);
          
          if (data.success) {
            toast.success("Vídeo publicado com sucesso!");
            router.refresh();
          } else if (data.error) {
            toast.error("Erro: " + data.status);
          }
        }
      } catch (e) {
        console.error("Erro ao analisar dados SSE", e);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      setIsPending(false);
      setStatusText("Falha na conexão.");
      toast.error("Falha na conexão com o servidor. O processo pode ainda estar ocorrendo no fundo.");
    };
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handlePublish}
        disabled={isPending}
        variant="outline"
        size="sm"
        className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-300 w-full"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
        ) : (
          <UploadCloud className="mr-2 h-3 w-3" />
        )}
        {isPending ? "Processando..." : "Publicar Reel"}
      </Button>
      {isPending && (
        <span className="text-xs text-muted-foreground animate-pulse text-center">
          {statusText}
        </span>
      )}
    </div>
  );
}
