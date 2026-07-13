"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao cadastrar.");
      }

      // Automatically redirect to login after successful registration
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Seu nome" 
          required 
          className="bg-[var(--input)] border-[var(--border)]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="seu@email.com" 
          required 
          className="bg-[var(--input)] border-[var(--border)]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          required 
          minLength={6}
          className="bg-[var(--input)] border-[var(--border)]"
        />
      </div>

      {error && (
        <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Criar conta
      </Button>
    </form>
  );
}
