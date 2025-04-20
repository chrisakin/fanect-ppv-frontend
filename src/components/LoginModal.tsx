import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login data:", data);
      // Implement your login logic here
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/callback&response_type=code&scope=email profile&prompt=select_account`;
    window.location.href = googleAuthUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogTitle className="sr-only">Login to FaNect</DialogTitle>
        <Card className="border-none">
          <CardContent className="flex flex-col items-center space-y-6 p-6">
            <div className="flex flex-col items-center space-y-2 w-full">
              <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
              <p className="text-sm text-muted-foreground text-center">
                Log in to discover the coolest events around you
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
              <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-10"
              >
                <img
                  className="w-5 h-5 mr-2"
                  alt="Google icon"
                  src="/icon-crypto-google.svg"
                />
                Log in with Google
              </Button>

              <div className="relative flex justify-center items-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <span className="relative bg-background px-2 text-sm text-muted-foreground">
                  Or
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    {...register("email")}
                    className="h-10"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password")}
                      className="h-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-10 w-10"
                    >
                      {showPassword ? (
                        <EyeIcon className="h-4 w-4" />
                      ) : (
                        <EyeOffIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <span className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 h-auto text-xs"
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!isValid}
                >
                  Log in
                </Button>
              </div>
            </form>

            <div className="text-sm text-center">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-green-600 hover:text-green-700"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};