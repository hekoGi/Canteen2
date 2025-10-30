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
import { UserPlus, Clock } from "lucide-react";
import bakkafrostLogo from "@assets/Bakkafrost_Logo_NEG_1757593907689.png";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await registerUser(data.username, data.password);
      setIsRegistered(true);
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Awaiting admin approval.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
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
                <div className="flex justify-center mb-4">
                  <Clock className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  Account Pending Approval
                </CardTitle>
                <CardDescription>
                  Your account has been created successfully
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  An administrator needs to approve your account before you can access the canteen management system. 
                  You will be able to log in once your account is approved.
                </p>

                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => setLocation("/login")}
                    data-testid="button-goto-login"
                  >
                    Go to Login
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/")}
                    data-testid="button-goto-home"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

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
                <UserPlus className="w-6 h-6" />
                <span>Register / Skráseta teg</span>
              </CardTitle>
              <CardDescription>
                Create a new account for canteen access
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password / Vátta loyniorð <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    data-testid="input-confirm-password"
                    {...form.register("confirmPassword")}
                    className={form.formState.errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive" data-testid="error-confirm-password">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  data-testid="button-register"
                >
                  {isSubmitting ? "Creating Account..." : "Register / Skráseta"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a 
                    href="/login" 
                    className="text-primary hover:underline"
                    data-testid="link-login"
                  >
                    Login here
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
