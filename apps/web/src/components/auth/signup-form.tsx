"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Phone,
  Lock,
  User,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* =========================
   VALIDATION SCHEMA
========================= */

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const OTP_TIMEOUT = 300; // 5 minutes in seconds

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(OTP_TIMEOUT);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Countdown timer
  useEffect(() => {
    if (step === "otp" && otpCountdown > 0) {
      timerRef.current = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, otpCountdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* =========================
     STEP 1: Register + Send OTP
  ========================= */
  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);

    try {
      const payload: any = {
        name: data.name,
        password: data.password,
      };

      if (data.email?.trim()) payload.email = data.email;
      if (data.phone?.trim()) payload.phone = data.phone;

      // 1. Register the user
      const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || result.message || "Registration failed");
      }

      // 2. Send OTP to email
      if (data.email?.trim()) {
        setRegisteredEmail(data.email);
        setIsSendingOtp(true);

        const otpRes = await fetch("http://localhost:3000/api/v1/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });

        const otpResult = await otpRes.json();
        if (!otpRes.ok) {
          throw new Error(otpResult.message || "Failed to send OTP");
        }

        setIsSendingOtp(false);
        setOtpCountdown(OTP_TIMEOUT);
        setStep("otp");
        toast.success("OTP sent to your email!");
      } else {
        // No email, just show success
        setShowSuccess(true);
        toast.success("Account created successfully");
      }
    } catch (error) {
      toast.error("Registration failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
      setIsSendingOtp(false);
    }
  }

  /* =========================
     STEP 2: Verify OTP
  ========================= */
  async function handleVerifyOtp() {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, otp: otpString }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "OTP verification failed");
      }

      setShowSuccess(true);
      toast.success("Email verified! Account is now active.");
    } catch (error) {
      toast.error("Verification failed", {
        description: error instanceof Error ? error.message : "Invalid OTP",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  /* =========================
     Resend OTP
  ========================= */
  async function handleResendOtp() {
    setIsSendingOtp(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail }),
      });

      if (!res.ok) throw new Error("Failed to resend OTP");

      setOtpCountdown(OTP_TIMEOUT);
      setOtp(["", "", "", "", "", ""]);
      toast.success("New OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsSendingOtp(false);
    }
  }

  /* =========================
     OTP Input Handlers
  ========================= */
  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i] || "";
    }
    setOtp(newOtp);
    otpInputRefs.current[Math.min(pasteData.length, 5)]?.focus();
  }

  /* =========================
     SUCCESS STATE
  ========================= */

  if (showSuccess) {
    return (
      <Card className="w-full max-w-md rounded-md border border-green-200 bg-white shadow-sm
                       dark:border-green-800 dark:bg-gray-900">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600 dark:text-green-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Account created & verified
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            You can now log in to your account.
          </p>
          <Link href="/login">
            <Button className="mt-6">Go to Login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  /* =========================
     OTP VERIFICATION STEP
  ========================= */

  if (step === "otp") {
    return (
      <Card className="w-full max-w-md rounded-md border border-gray-200 bg-white shadow-sm
                       dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Verify your email
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            We sent a 6-digit code to <strong className="text-gray-900 dark:text-gray-200">{registeredEmail}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { otpInputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="h-14 w-12 rounded-lg border-2 border-gray-200 bg-white text-center text-xl font-bold
                           text-gray-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center">
            {otpCountdown > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Code expires in{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(otpCountdown)}
                </span>
              </p>
            ) : (
              <p className="text-sm font-medium text-red-500">
                OTP expired. Please request a new one.
              </p>
            )}
          </div>

          {/* Verify Button */}
          <Button
            className="w-full rounded-md"
            onClick={handleVerifyOtp}
            disabled={isVerifyingOtp || otp.join("").length !== 6 || otpCountdown === 0}
          >
            {isVerifyingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isVerifyingOtp ? "Verifying..." : "Verify Email"}
          </Button>

          {/* Resend */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSendingOtp || otpCountdown > 0}
              className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline dark:text-blue-400 dark:disabled:text-gray-600"
            >
              {isSendingOtp ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* =========================
     SIGNUP FORM (STEP 1)
  ========================= */

  return (
    <Card className="w-full max-w-md rounded-md border border-gray-200 bg-white shadow-sm
                     dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="pb-6 text-center">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Create an account
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Sign up to continue to GrievanceHub
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="dark:text-gray-200">Full name</Label>
            <Input 
                id="name" 
                placeholder="John Doe" 
                {...register("name")} 
                className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-gray-500"
            />
            {errors.name && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
            <Input 
                id="email" 
                placeholder="john@example.com" 
                {...register("email")} 
                className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-gray-500"
            />
            {errors.email && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="dark:text-gray-200">Phone (optional)</Label>
            <Input 
                id="phone" 
                placeholder="+91 98765 43210" 
                {...register("phone")} 
                className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-gray-500"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700
                          dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
            <ShieldCheck className="inline-block w-3 h-3 mr-1" />
            A verification OTP will be sent to your email after signup.
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="pr-10 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500
                           hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="dark:text-gray-200">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="pr-10 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500
                           hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full rounded-md dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-gray-200 pt-4
                             dark:border-gray-800">
        <Link
          href="/login"
          className="text-sm text-gray-700 hover:underline dark:text-gray-300"
        >
          Already have an account? Log in
        </Link>
      </CardFooter>
    </Card>
  );
}