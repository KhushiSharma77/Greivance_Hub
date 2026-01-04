"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Shield, ShieldCheck, Loader2 } from "lucide-react"
import { api, ApiError } from "@/lib/api"

type UserRole = "user" | "officer" | "superadmin"

interface FormErrors {
    email?: string
    password?: string
    general?: string
}

export default function LoginPage() {
    const [activeRole, setActiveRole] = useState<UserRole>("user")

    const roleConfig = {
        user: {
            icon: User,
            title: "Citizen Login",
            description: "Access your grievances and track their status",
            color: "from-blue-500 to-cyan-500"
        },
        officer: {
            icon: Shield,
            title: "Officer Login",
            description: "Manage and resolve citizen grievances",
            color: "from-purple-500 to-pink-500"
        },
        superadmin: {
            icon: ShieldCheck,
            title: "Super Admin Login",
            description: "Full system administration and oversight",
            color: "from-orange-500 to-red-500"
        }
    }

    const LoginForm = ({ role }: { role: UserRole }) => {
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [isLoading, setIsLoading] = useState(false)
        const [errors, setErrors] = useState<FormErrors>({})

        const config = roleConfig[role]
        const Icon = config.icon

        const validateEmail = (email: string): boolean => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(email)
        }

        const validateForm = (): boolean => {
            const newErrors: FormErrors = {}

            if (!email.trim()) {
                newErrors.email = "Email is required"
            } else if (!validateEmail(email)) {
                newErrors.email = "Please enter a valid email address"
            }

            if (!password) {
                newErrors.password = "Password is required"
            } else if (password.length < 6) {
                newErrors.password = "Password must be at least 6 characters"
            }

            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
        }

        const handleLogin = async (e: React.FormEvent) => {
            e.preventDefault()

            // Reset errors
            setErrors({})

            // Validate form
            if (!validateForm()) {
                return
            }

            setIsLoading(true)

            try {
                const response = await api.login({
                    email,
                    password,
                    role
                })

                if (response.success && response.data) {
                    // Store token
                    localStorage.setItem("auth_token", response.data.token)
                    localStorage.setItem("user_role", response.data.user.role)

                    // Redirect based on role
                    window.location.href = role === "user" ? "/dashboard" : role === "officer" ? "/officer" : "/admin"
                }
            } catch (error) {
                if (error instanceof ApiError) {
                    setErrors({ general: error.message })
                } else {
                    setErrors({ general: "An unexpected error occurred. Please try again." })
                }
            } finally {
                setIsLoading(false)
            }
        }

        return (
            <div className="animate-fade-in">
                <div className={`flex items-center gap-3 mb-6 justify-center`}>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{config.title}</h2>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                </div>

                {errors.general && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${role}-email`} className="text-sm font-medium">
                            Email Address
                        </Label>
                        <Input
                            id={`${role}-email`}
                            type="email"
                            placeholder={`${role}@example.com`}
                            className={`transition-all focus:scale-[1.01] ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                if (errors.email) {
                                    setErrors({ ...errors, email: undefined })
                                }
                            }}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${role}-password`} className="text-sm font-medium">
                            Password
                        </Label>
                        <Input
                            id={`${role}-password`}
                            type="password"
                            placeholder="••••••••"
                            className={`transition-all focus:scale-[1.01] ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (errors.password) {
                                    setErrors({ ...errors, password: undefined })
                                }
                            }}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id={`${role}-remember`} disabled={isLoading} />
                            <label
                                htmlFor={`${role}-remember`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-lg text-white font-semibold py-6`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            `Sign In as ${role === "user" ? "Citizen" : role === "officer" ? "Officer" : "Super Admin"}`
                        )}
                    </Button>
                </form>

                {role === "user" && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <a href="/register" className="font-medium text-primary hover:underline">
                                Register here
                            </a>
                        </p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-background/95 shadow-2xl border-2">
                <CardHeader className="text-center space-y-2 pb-6">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-base">
                        Select your role and sign in to continue
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs
                        defaultValue="user"
                        className="w-full"
                        onValueChange={(value) => setActiveRole(value as UserRole)}
                    >
                        <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-muted/50">
                            <TabsTrigger
                                value="user"
                                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-200"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Citizen
                            </TabsTrigger>
                            <TabsTrigger
                                value="officer"
                                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-200"
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Officer
                            </TabsTrigger>
                            <TabsTrigger
                                value="superadmin"
                                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200"
                            >
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Admin
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="user" className="mt-0">
                            <LoginForm role="user" />
                        </TabsContent>

                        <TabsContent value="officer" className="mt-0">
                            <LoginForm role="officer" />
                        </TabsContent>

                        <TabsContent value="superadmin" className="mt-0">
                            <LoginForm role="superadmin" />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
