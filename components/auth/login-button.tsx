"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

interface LoginButtonProps {
  children: React.ReactNode;
  mode: "model" | "redirect";
  asChild?: boolean;
  redirectUri?: string;
  type?: "login" | "register";
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
  type = "login",
  redirectUri,
}: LoginButtonProps) => {
  const router = useRouter();

  if (mode === "model") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          {type === "login" ? <LoginForm /> : <RegisterForm />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span
      onClick={() => {
        router.push(redirectUri ? redirectUri : "auth/login");
      }}
      className="cursor-pointer"
    >
      {children}
    </span>
  );
};
