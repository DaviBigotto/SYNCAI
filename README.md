# TikTok Sync

TikTok Sync is a modern web application built to streamline and synchronize data/content with TikTok. This project serves as a personal dashboard to manage integrations, view analytics, and automate tasks.

## 🚀 Technologies Used

This project is built with a modern tech stack to ensure performance, scalability, and a great developer experience:

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with Framer Motion for animations
- **Database ORM**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Auth.js)
- **UI Components**: Shadcn UI & Lucide React for icons
- **Data Visualization**: Recharts

## 📦 Getting Started

### Prerequisites

- Node.js installed
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tiktok-sync.git
   cd tiktok-sync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure your database and authentication variables (e.g., `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.).

4. Run database migrations:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 License

This is a personal project.
