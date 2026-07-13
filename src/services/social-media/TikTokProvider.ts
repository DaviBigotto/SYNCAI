import { SocialMediaProvider, SocialMediaPost } from "./SocialMediaProvider";

export class TikTokProvider implements SocialMediaProvider {
  name = "tiktok";

  async fetchRecentPosts(username: string): Promise<SocialMediaPost[]> {
    console.log(`Fetching real TikToks for @${username} via TikWM API...`);
    
    try {
      // Fazendo uma requisição real para uma API pública não-oficial de TikTok
      const response = await fetch(`https://www.tikwm.com/api/user/posts?unique_id=${username}&count=15`);
      const data = await response.json();

      if (data.code === 0 && data.data && data.data.videos) {
        return data.data.videos.map((post: any) => ({
          id: post.video_id || post.id,
          url: `https://tiktok.com/@${username}/video/${post.video_id || post.id}`,
          description: post.title || "Vídeo sem descrição",
          mediaUrl: post.play || post.wmplay, // URL do vídeo (com ou sem marca d'água)
          coverUrl: post.cover || post.origin_cover,
          createdAt: new Date(post.create_time * 1000)
        }));
      } else if (data.code === -1 || (data.data && !data.data.videos)) {
        console.warn("TikTok API returned empty or error -1 (probably no videos):", data);
        return [];
      } else {
        console.error("TikTok API Error:", data);
        throw new Error(data.msg || "Não foi possível carregar os vídeos reais.");
      }
    } catch (error) {
      console.error("Failed to fetch real TikToks:", error);
      throw new Error("Erro ao conectar com o TikTok. Tente novamente mais tarde.");
    }
  }

  async publishPost(mediaUrl: string, caption?: string): Promise<{ success: boolean; postId?: string; error?: string }> {
    throw new Error("TikTokProvider.publishPost não suportado. Usamos o TikTok apenas como fonte (Read-Only).");
  }
}
