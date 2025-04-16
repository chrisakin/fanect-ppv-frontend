import { EyeOffIcon, EyeIcon } from "lucide-react";
import  { useState } from "react";
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

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log("Google login clicked");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent">
        <DialogTitle className="sr-only">Login to FaNect</DialogTitle>
        <Card className="w-[750px] bg-background text-foreground rounded-[10px]">
          <CardContent className="flex flex-col items-center p-0">
            <div className="flex flex-col w-[600px] items-center gap-[60px] py-14 mx-auto">
              <div className="flex flex-col w-[489px] items-center gap-11">
                <div className="[font-family:'Sofia_Pro-SemiBold',Helvetica] font-semibold text-green-600 text-[42.1px] tracking-[-0.84px] leading-[56.1px]">
                  FaNect
                </div>

                <div className="flex flex-col items-center w-full">
                  <h1 className="font-display-lg-semibold font-[number:var(--display-lg-semibold-font-weight)] text-gray-800 text-[length:var(--display-lg-semibold-font-size)] text-center tracking-[var(--display-lg-semibold-letter-spacing)] leading-[var(--display-lg-semibold-line-height)]">
                    Log in
                  </h1>
                  <p className="font-display-xs-regular font-[number:var(--display-xs-regular-font-weight)] text-[#717680] text-[length:var(--display-xs-regular-font-size)] text-center tracking-[var(--display-xs-regular-letter-spacing)] leading-[var(--display-xs-regular-line-height)]">
                    Log in to discover the coolest events around you
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-col items-center justify-center gap-6 w-full">
                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    variant="outline"
                    className="h-[60px] w-full rounded-[10px] border border-solid border-[#1aaa65] text-green-600 font-text-xl-semibold font-[number:var(--text-xl-semibold-font-weight)] text-[length:var(--text-xl-semibold-font-size)] tracking-[var(--text-xl-semibold-letter-spacing)] leading-[var(--text-xl-semibold-line-height)]"
                  >
                    <img
                      className="w-6 h-6 mr-2.5"
                      alt="Google icon"
                      src="/icon-crypto-google.svg"
                    />
                    Log in with Google
                  </Button>

                  <div className="font-text-xl-regular font-[number:var(--text-xl-regular-font-weight)] text-[#717680] text-[length:var(--text-xl-regular-font-size)] tracking-[var(--text-xl-regular-letter-spacing)] leading-[var(--text-xl-regular-line-height)]">
                    Or
                  </div>

                  <div className="flex flex-col items-start gap-6 w-full">
                    <div className="flex flex-col items-start gap-1.5 w-full">
                      <label
                        htmlFor="email"
                        className="text-gray-800 font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        {...register("email")}
                        className="h-[62px] bg-gray-50 border border-solid border-[#d5d7da] [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-[#bbbbbb] text-base tracking-[-0.32px]"
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <span className="text-red-500 text-sm">{errors.email.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-1.5 w-full">
                    <div className="flex justify-between items-center w-full">
                      <label
                        htmlFor="password"
                        className="text-gray-800 font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]"
                      >
                        Password
                      </label>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-green-600 font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]"
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="relative w-full">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className="h-[60px] bg-gray-50 border border-solid border-[#d5d7da] [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-[#bbbbbb] text-base tracking-[-0.32px] pr-10"
                        placeholder="Enter password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        {showPassword ? (
                          <EyeIcon className="h-6 w-6" />
                        ) : (
                          <EyeOffIcon className="h-6 w-6" />
                        )}
                      </Button>
                      {errors.password && (
                        <span className="text-red-500 text-sm">{errors.password.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-5 w-full">
                    <Button
                      type="submit"
                      className={`h-[60px] w-full bg-green-600 rounded-[10px] font-text-lg-semibold font-[number:var(--text-lg-semibold-font-weight)] text-whitewhite text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] ${
                        !isValid ? "opacity-50" : ""
                      }`}
                      disabled={!isValid}
                    >
                      Log in
                    </Button>

                    <div className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-[length:var(--text-lg-regular-font-size)] text-center tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)]">
                      <span className="text-[#414651]">
                        You don&apos;t have an account?{" "}
                      </span>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-[#1aaa65] font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)]"
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};