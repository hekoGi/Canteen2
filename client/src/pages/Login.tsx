import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect parameter from URL
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('redirect') || '/registrations';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.username, data.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      setLocation(redirectTo);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="relative py-8">
        <div className="flex justify-center mb-8">
          <img 
            src={bakkafrostLogo} 
            alt="Bakkafrost Logo" 
            className="h-16"
          />
        </div>

        <div className="max-w-md mx-auto p-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <LogIn className="w-6 h-6" />
                <span>Login / Innrita</span>
              </CardTitle>
              <CardDescription>
                Sign in to access canteen management
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Username / Brúkaranavn <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="username"
                    data-testid="input-username"
                    {...form.register("username")}
                    className={form.formState.errors.username ? "border-destructive" : ""}
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-destructive" data-testid="error-username">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password / Loyniorð <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    data-testid="input-password"
                    {...form.register("password")}
                    className={form.formState.errors.password ? "border-destructive" : ""}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive" data-testid="error-password">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  data-testid="button-login"
                >
                  {isSubmitting ? "Logging in..." : "Login / Innrita"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a 
                    href="/register" 
                    className="text-primary hover:underline"
                    data-testid="link-register"
                  >
                    Register here
                  </a>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <a 
                    href="/" 
                    className="text-primary hover:underline"
                    data-testid="link-home"
                  >
                    ← Back to Home
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
