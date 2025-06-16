import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EyeOffIcon, EyeIcon, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import axios from "../../lib/axios";

const passwordResetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

export const PasswordReset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"form" | "success" | "error">("form");
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid reset token");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`/auth/reset/${token}`, {
        password: data.password,
      });
      
      setStatus("success");
      toast({
        title: "Success",
        description: "Password reset successfully",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {status === "form" && (
            <Card className="border-none shadow-lg mt-10">
              <CardContent className="flex flex-col items-center space-y-8 p-8 mt-20">
                <div className="flex flex-col items-center space-y-6 w-full">
                  <h1 className="text-2xl font-semibold tracking-tight text-green-600">FaNect</h1>
                  <div className="space-y-3 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight">Reset Password</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your new password below
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                  <div className="space-y-4">
                    {/* New Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...register("password")}
                          className="h-12 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-0 h-12 w-12"
                          disabled={isLoading}
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

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...register("confirmPassword")}
                          className="h-12 pr-10"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-0 top-0 h-12 w-12"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeIcon className="h-4 w-4" />
                          ) : (
                            <EyeOffIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-xs text-red-500 mt-1">
                          {errors.confirmPassword.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                    disabled={!isValid || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleBackToLogin}
                      className="p-0 h-auto text-green-600 hover:text-green-700"
                      disabled={isLoading}
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {status === "success" && (
            <Card className="border-none shadow-lg">
              <CardContent className="flex flex-col items-center space-y-8 p-8">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold">Password Reset Successful!</h2>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                  </p>
                </div>
                <Button
                  onClick={handleBackToLogin}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          )}

          {status === "error" && (
            <Card className="border-none shadow-lg">
              <CardContent className="flex flex-col items-center space-y-8 p-8">
                <XCircle className="h-16 w-16 text-red-600" />
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold">Password Reset Failed</h2>
                  <p className="text-sm text-muted-foreground">
                    {errorMessage}
                  </p>
                </div>
                <Button
                  onClick={handleBackToLogin}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  Back to Login
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};