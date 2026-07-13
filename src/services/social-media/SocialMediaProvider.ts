export interface SocialMediaPost {
  id: string;
  url: string;
  description?: string;
  mediaUrl: string;
  coverUrl?: string;
  createdAt: Date;
}

export interface SocialMediaProvider {
  /**
   * Identificador do provedor (ex: "tiktok", "instagram")
   */
  name: string;

  /**
   * Retorna os posts mais recentes de uma conta
   * @param username Nome de usuário na plataforma
   */
  fetchRecentPosts(username: string): Promise<SocialMediaPost[]>;

  /**
   * Publica um conteúdo na plataforma
   * @param mediaUrl URL do vídeo a ser publicado
   * @param caption Legenda da publicação
   */
  publishPost(mediaUrl: string, caption?: string): Promise<{ success: boolean; postId?: string; error?: string }>;
}
