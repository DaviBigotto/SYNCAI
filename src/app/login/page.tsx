import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Terminal } from "lucide-react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default async function LoginPage() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold font-heading tracking-tight text-foreground">SyncAI</span>
            </div>
          </Link>
        </div>
        
        <Card className="border-white/10 bg-[#111113] shadow-2xl shadow-black/50">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight font-heading">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-muted-foreground">
              Entre com seu email para acessar seu painel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#111113] px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <form
              action={async () => {
                "use server"
                await signIn("github", { redirectTo: "/dashboard" })
              }}
            >
              <Button type="submit" variant="outline" className="w-full h-10 border-[var(--border)] bg-[var(--input)] hover:bg-white/5 transition-colors">
                <Terminal className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </form>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              Ainda não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
