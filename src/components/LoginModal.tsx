import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useState, useRef } from "react";
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

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isValid: isLoginValid },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isValid: isSignupValid },
    reset: resetSignup,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const {
    handleSubmit: handleVerificationSubmit,
    formState: { errors: verificationErrors },
    reset: resetVerification,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Move to next input if value is entered
      if (value && index < 5) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      otpInputs.current[index - 1]?.focus();
    }
  };

  const onLogin = async (data: LoginFormData) => {
    try {
      console.log("Login data:", data);
      // Implement your login logic here
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onSignup = async (data: SignupFormData) => {
    try {
      console.log("Signup data:", data);
      setUserEmail(data.email);
      setShowVerification(true);
      // Implement your signup logic here
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const onVerify = async () => {
    try {
      const code = otpValues.join("");
      console.log("Verification code:", code);
      // Implement your verification logic here
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const handleGoogleAuth = async () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/callback&response_type=code&scope=email profile&prompt=select_account`;
    window.location.href = googleAuthUrl;
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setShowPassword(false);
    setShowVerification(false);
    resetLogin();
    resetSignup();
    resetVerification();
  };

  const resendOTP = () => {
    // Implement resend OTP logic here
    console.log("Resending OTP to:", userEmail);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogTitle className="sr-only">
          {showVerification ? "Verify Email" : isSignup ? "Create Account" : "Login to FaNect"}
        </DialogTitle>
        <Card className="border-none">
          <CardContent className="flex flex-col items-center space-y-8 p-8">
            {showVerification ? (
              <div className="flex flex-col items-center space-y-10 w-full">
                <div className="flex flex-col items-center space-y-6">
                  <h1 className="text-2xl font-semibold tracking-tight text-green-600">FaNect</h1>
                  <div className="space-y-3 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight">Verify Email Address</h2>
                    <p className="text-sm text-muted-foreground">
                      A 6-digit OTP has been sent to your email<br />
                      {userEmail}. Enter it below
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerificationSubmit(onVerify)} className="w-full space-y-8">
                  <div className="grid grid-cols-6 gap-3">
                    {otpValues.map((value, index) => (
                      <Input
                        key={index}
                        ref={el => otpInputs.current[index] = el}
                        type="text"
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-full h-12 text-center text-lg bg-transparent border-2 rounded-lg"
                        maxLength={1}
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  >
                    Continue
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Did not receive OTP?{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={resendOTP}
                        className="p-0 h-auto text-green-600 hover:text-green-700"
                      >
                        Resend OTP
                      </Button>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center space-y-2 w-full">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {isSignup ? "Create Account" : "Log in"}
                  </h1>
                  <p className="text-sm text-muted-foreground text-center">
                    {isSignup
                      ? "Sign up to discover the coolest events around you"
                      : "Log in to discover the coolest events around you"}
                  </p>
                </div>

                <form
                  onSubmit={
                    isSignup
                      ? handleSignupSubmit(onSignup)
                      : handleLoginSubmit(onLogin)
                  }
                  className="w-full space-y-4"
                >
                  <Button
                    type="button"
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full h-10"
                  >
                    <img
                      className="w-5 h-5 mr-2"
                      alt="Google icon"
                      src="/icon-crypto-google.svg"
                    />
                    {isSignup ? "Sign up with Google" : "Log in with Google"}
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
                    {isSignup && (
                      <>
                        <div>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="First Name"
                            {...registerSignup("firstName")}
                            className="h-10"
                          />
                          {signupErrors.firstName && (
                            <span className="text-xs text-red-500 mt-1">
                              {signupErrors.firstName.message}
                            </span>
                          )}
                        </div>

                        <div>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Last Name"
                            {...registerSignup("lastName")}
                            className="h-10"
                          />
                          {signupErrors.lastName && (
                            <span className="text-xs text-red-500 mt-1">
                              {signupErrors.lastName.message}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    <div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        {...(isSignup ? registerSignup("email") : registerLogin("email"))}
                        className="h-10"
                      />
                      {(isSignup ? signupErrors.email : loginErrors.email) && (
                        <span className="text-xs text-red-500 mt-1">
                          {isSignup
                            ? signupErrors.email?.message
                            : loginErrors.email?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...(isSignup
                            ? registerSignup("password")
                            : registerLogin("password"))}
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
                      {(isSignup ? signupErrors.password : loginErrors.password) && (
                        <span className="text-xs text-red-500 mt-1">
                          {isSignup
                            ? signupErrors.password?.message
                            : loginErrors.password?.message}
                        </span>
                      )}
                    </div>

                    {!isSignup && (
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 h-auto text-xs"
                        >
                          Forgot Password?
                        </Button>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isSignup ? !isSignupValid : !isLoginValid}
                    >
                      {isSignup ? "Create Account" : "Log in"}
                    </Button>
                  </div>
                </form>

                <div className="text-sm text-center">
                  <span className="text-muted-foreground">
                    {isSignup ? "Have an account? " : "Don't have an account? "}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    onClick={toggleMode}
                    className="p-0 h-auto text-green-600 hover:text-green-700"
                  >
                    {isSignup ? "Log in" : "Create Account"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};