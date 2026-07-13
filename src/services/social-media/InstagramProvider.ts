import { SocialMediaProvider, SocialMediaPost } from "./SocialMediaProvider";
import axios from "axios";

export class InstagramProvider implements SocialMediaProvider {
  name = "instagram";
  private accessToken: string;
  private instagramAccountId: string;

  constructor(accessToken: string, accountId: string) {
    this.accessToken = accessToken;
    this.instagramAccountId = accountId;
  }

  async fetchRecentPosts(username: string): Promise<SocialMediaPost[]> {
    throw new Error("InstagramProvider.fetchRecentPosts não suportado neste momento. O Instagram é usado apenas para publicação.");
  }

  async publishPost(mediaUrl: string, caption?: string) {
    if (!this.accessToken || !this.instagramAccountId) {
      throw new Error("Chaves de acesso do Instagram ausentes nas configurações do usuário.");
    }

    console.log(`Publicando Reel no Instagram...`);
    
    try {
      // 1. Cria um Container (Fase de Upload)
      const containerResponse = await axios.post(
        `https://graph.facebook.com/v19.0/${this.instagramAccountId}/media`,
        null,
        {
          params: {
            media_type: "REELS",
            video_url: mediaUrl,
            caption: caption || "",
            access_token: this.accessToken
          }
        }
      );

      const containerId = containerResponse.data.id;
      if (!containerId) {
        throw new Error("Falha ao criar Container de Reel na Meta API");
      }

      console.log(`Container do Reel criado: ${containerId}. Aguardando processamento da Meta...`);

      // 2. Polling: Aguarda a Meta processar o vídeo (pode demorar até 30s)
      let isReady = false;
      let attempts = 0;
      while (!isReady && attempts < 15) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Espera 3s
        attempts++;
        
        try {
          const statusRes = await axios.get(
            `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${this.accessToken}`
          );
          const status = statusRes.data.status_code;
          console.log(`Status do processamento (${attempts}/15): ${status}`);
          
          if (status === 'FINISHED') {
            isReady = true;
          } else if (status === 'ERROR') {
            throw new Error("A Meta encontrou um erro ao processar o arquivo de vídeo.");
          }
        } catch (statusError: any) {
          console.log("Erro ao checar status, tentando novamente...", statusError.message);
        }
      }

      if (!isReady) {
        throw new Error("Tempo limite excedido. O Instagram demorou muito para processar o vídeo.");
      }

      // 3. Publica o Container (Fase de Postagem)
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v19.0/${this.instagramAccountId}/media_publish`,
        null,
        {
          params: {
            creation_id: containerId,
            access_token: this.accessToken
          }
        }
      );

      const mediaId = publishResponse.data.id;
      
      console.log(`Sucesso! Reel publicado com ID: ${mediaId}`);
      return { success: true, mediaId };

    } catch (error: any) {
      console.error("Erro na API do Instagram:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        "Falha ao conectar com o Instagram. Verifique se seu Access Token é válido e se a conta é Comercial/Criador."
      );
    }
  }
}
