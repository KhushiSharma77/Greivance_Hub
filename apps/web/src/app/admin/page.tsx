"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, ShieldCheck, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Welcome back, Administrator. Here's an overview of the system.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/admin/complaints">
                    <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 border-indigo-200 hover:shadow-lg transition-all cursor-pointer group">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Complaints</p>
                                    <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">View All</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/departments">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Departments</p>
                                    <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Manage</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/users">
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 hover:shadow-lg transition-all cursor-pointer group">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Users</p>
                                    <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">Manage</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">System Status</p>
                                <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300">Active</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
