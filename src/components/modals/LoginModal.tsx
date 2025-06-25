import { EyeOffIcon, EyeIcon, Loader2, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import axios from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { setLoggedinUser, setTokens } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  userName: z.string().min(1, "User name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAuth, setUser } = useAuthStore();

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
    reset: resetVerification,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
  });

  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors, isValid: isForgotPasswordValid },
    reset: resetForgotPassword,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData?.getData('text').trim();
      if (pastedData && /^\d{6}$/.test(pastedData)) {
        const digits = pastedData.split('');
        const newOtpValues = [...otpValues];
        digits.forEach((digit, index) => {
          if (index < 6) {
            newOtpValues[index] = digit;
            if (otpInputs.current[index]) {
              otpInputs.current[index]!.value = digit;
            }
          }
        });
        setOtpValues(newOtpValues);
        otpInputs.current[5]?.focus();
      }
    };

    const firstInput = otpInputs.current[0];
    if (firstInput) {
      firstInput.addEventListener('paste', handlePaste);
    }

    return () => {
      if (firstInput) {
        firstInput.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value.slice(0, 1);
      setOtpValues(newOtpValues);

      // Move to next input if value is entered
      if (value && index < 5) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        // Move to previous input on backspace if current input is empty
        otpInputs.current[index - 1]?.focus();
      } else {
        // Clear current input on backspace
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setLoggedinUser(response.data)
      setUser(response.data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
    }
  };

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const redirectUrl = sessionStorage.getItem('redirectUrl')
      const response = await axios.post('/auth/login', data);
      const { accessToken, refreshToken } = response.data?.data;
      setTokens(accessToken, refreshToken);
      await fetchUserProfile();
      setAuth(true);
      onClose();
      if(redirectUrl) {
        sessionStorage.removeItem('redirectUrl')
        navigate(redirectUrl)
      }else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.response?.data?.message === 'User is not verified') {
        setUserEmail(data.email);
        setShowVerification(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "An error occurred during login",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await axios.post('/auth/register', data);
      setUserEmail(data.email);
      setShowVerification(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "An error occurred during registration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify = async () => {
    const code = otpValues.join("");
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a complete 6-digit code",
      });
      return;
    }

    setIsLoading(true);
    try {
            const redirectUrl = sessionStorage.getItem('redirectUrl')
      const { accessToken, refreshToken } = (await axios.post('/auth/verify', { code, email: userEmail })).data?.data;
      setTokens(accessToken, refreshToken);
      await fetchUserProfile();
      setAuth(true);
      onClose();
     if(redirectUrl) {
        sessionStorage.removeItem('redirectUrl')
        navigate(redirectUrl)
      }else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "An error occurred during verification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await axios.post('/auth/forgot-password', data);
      toast({
        title: "Success",
        description: "Password reset link has been sent to your email",
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "An error occurred while sending reset email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      setIsLoading(true);
      try {
        const redirectUrl = sessionStorage.getItem('redirectUrl')
        const { data } = await axios.post('/auth/google', {
          code: response.code,
          path: isSignup ? "signup": "login",
        });
        const { accessToken, refreshToken } = data.data;
        setTokens(accessToken, refreshToken);
        await fetchUserProfile();
        setAuth(true);
        onClose();
        if(redirectUrl) {
        sessionStorage.removeItem('redirectUrl')
        navigate(redirectUrl)
      }else {
        navigate('/dashboard');
      }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to authenticate with Google"
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Google authentication failed"
      });
    },
  });

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setShowPassword(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    resetLogin();
    resetSignup();
    resetVerification();
    resetForgotPassword();
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      await axios.post('/auth/resend-otp', { email: userEmail });
      toast({
        title: "Success",
        description: "OTP has been resent to your email",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowVerification(false);
    resetForgotPassword();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogTitle className="sr-only">
          {showForgotPassword ? "Forgot Password" : showVerification ? "Verify Email" : isSignup ? "Create Account" : "Login to FaNect"}
        </DialogTitle>
        <Card className="border-none">
          <CardContent className="flex flex-col items-center space-y-8 p-8">
            {showForgotPassword ? (
              <div className="flex flex-col items-center space-y-10 w-full">
                <div className="flex flex-col items-center space-y-6">
                  <h1 className="text-2xl font-semibold tracking-tight text-green-600">FaNect</h1>
                  <div className="space-y-3 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight">Forgot Password</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your email address and we'll send you a link to reset your password
                    </p>
                  </div>
                </div>

                <form onSubmit={handleForgotPasswordSubmit(onForgotPassword)} className="w-full space-y-6">
                  <div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      {...registerForgotPassword("email")}
                      className="h-10"
                      disabled={isLoading}
                    />
                    {forgotPasswordErrors.email && (
                      <span className="text-xs text-red-500 mt-1">
                        {forgotPasswordErrors.email.message}
                      </span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                    disabled={!isForgotPasswordValid || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleBackToLogin}
                      className="p-0 h-auto text-green-600 hover:text-green-700 flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Login
                    </Button>
                  </div>
                </form>
              </div>
            ) : showVerification ? (
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

                <form onSubmit={(e) => { e.preventDefault(); onVerify(); }} className="w-full space-y-8">
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
                        disabled={isLoading}
                        inputMode="numeric"
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                    disabled={isLoading || otpValues.some(v => !v)}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Did not receive OTP?{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={resendOTP}
                        className="p-0 h-auto text-green-600 hover:text-green-700"
                        disabled={isLoading}
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
                    onClick={() => handleGoogleAuth()}
                    variant="outline"
                    className="w-full h-10"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <img
                          className="w-5 h-5 mr-2"
                          alt="Google icon"
                          src="/icon-crypto-google.svg"
                        />
                        {isSignup ? "Sign up with Google" : "Log in with Google"}
                      </>
                    )}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                          />
                          {signupErrors.lastName && (
                            <span className="text-xs text-red-500 mt-1">
                              {signupErrors.lastName.message}
                            </span>
                          )}
                        </div>
                         <div>
                          <Input
                            id="userName"
                            type="text"
                            placeholder="User Name (Nick Name)"
                            {...registerSignup("userName")}
                            className="h-10"
                            disabled={isLoading}
                          />
                          {signupErrors.userName && (
                            <span className="text-xs text-red-500 mt-1">
                              {signupErrors.userName.message}
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
                        disabled={isLoading}
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
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-0 h-10 w-10"
                          disabled={isLoading}
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
                          onClick={() => setShowForgotPassword(true)}
                          disabled={isLoading}
                        >
                          Forgot Password?
                        </Button>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isSignup ? !isSignupValid || isLoading : !isLoginValid || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        isSignup ? "Create Account" : "Log in"
                      )}
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
                    disabled={isLoading}
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