"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, AtSign } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useToast } from "@/src/hooks/use-toast";
import { ModeToggle } from "@/src/components/mode-toggle";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Logged in successfully",
      description: "Welcome back to UniConnect!",
    });

    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>UniConnect</span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-[1000px] gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Welcome Back
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Connect with your university community. Share ideas, join
                groups, and stay updated with campus happenings.
              </p>
            </div>
            <div className="hidden space-y-4 md:block">
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AtSign className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium">Stay Connected</h3>
                  <p className="text-sm text-muted-foreground">
                    Build your network with peers and faculty
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium">Academic Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Access study materials and course discussions
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">Sign In</h2>
              <p className="text-sm text-muted-foreground">
                Enter your email below to sign in to your account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.jordan@university.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
