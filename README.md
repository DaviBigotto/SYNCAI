# TikTok Sync

O TikTok Sync é uma aplicação web moderna construída para automatizar e sincronizar conteúdo do TikTok diretamente para o Instagram Reels. Este projeto funciona como um painel pessoal para gerenciar integrações, visualizar automações e publicar vídeos sem esforço.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com ferramentas modernas para garantir alta performance e escalabilidade:

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/) com Framer Motion para animações
- **Banco de Dados (ORM)**: [Prisma](https://www.prisma.io/) com PostgreSQL (Neon)
- **Autenticação**: [NextAuth.js](https://next-auth.js.org/)
- **Componentes de Interface**: Shadcn UI & Lucide React para ícones
- **Integrações de API**: Meta Graph API (Instagram) e TikWM API (TikTok)

## 📦 Como Rodar o Projeto

### Pré-requisitos

- Node.js instalado no seu computador
- Um banco de dados PostgreSQL (recomenda-se Neon ou Vercel Postgres)

### Instalação e Execução Local

1. Clone este repositório:
   ```bash
   git clone https://github.com/DaviBigotto/SYNCAI.git
   cd SYNCAI
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo chamado `.env` na raiz do projeto e configure as variáveis de autenticação e banco de dados (ex: `DATABASE_URL`, `AUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, etc.).

4. Atualize o banco de dados (Prisma):
   ```bash
   npx prisma db push
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o sistema rodando.

## 📝 Licença

Este é um projeto de automação pessoal.
