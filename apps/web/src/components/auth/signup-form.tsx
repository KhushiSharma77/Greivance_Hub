"use client";

import { useState } from "react";
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

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);

    try {
      const payload: any = {
        name: data.name,
        password: data.password,
      };

      if (data.email?.trim()) payload.email = data.email;
      if (data.phone?.trim()) payload.phone = data.phone;

      const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || result.message || "Registration failed");
      }

      setShowSuccess(true);
      toast.success("Account created successfully");

      setTimeout(() => {
        reset();
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      toast.error("Registration failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
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
            Account created
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            You can now log in to your account.
          </p>
        </CardContent>
      </Card>
    );
  }

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
            <Label htmlFor="email" className="dark:text-gray-200">Email (optional)</Label>
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
          <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600
                          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Provide at least one contact method (email or phone).
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