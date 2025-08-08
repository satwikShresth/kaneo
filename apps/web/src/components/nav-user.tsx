import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { authClient } from "@kaneo/libs";

export type SignInFormValues = {
  email: string;
  password: string;
};

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export function NavUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SignInFormValues>({
    resolver: standardSchemaResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    if (isSigningIn) return;

    setIsSigningIn(true);

    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      toast.success("Signed in successfully");

      setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sign in"
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-300 mb-1.5 block">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100"
                    placeholder="you@example.com"
                    disabled={isSigningIn}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-300 mb-1.5 block">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      disabled={isSigningIn}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSigningIn}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    disabled={isSigningIn}
                    className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50"
                  >
                    Forgot password?
                  </button>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSigningIn}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 mt-6"
        >
          {isSigningIn ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
