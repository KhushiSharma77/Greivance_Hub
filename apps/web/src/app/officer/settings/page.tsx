"use client"

import { Settings, User, Bell, Shield, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OfficerSettingsPage() {
    const sections = [
        { icon: User, title: "Profile Settings", desc: "Manage your personal information and contact details." },
        { icon: Bell, title: "Notification Preferences", desc: "Choose how and when you want to be notified about grievances." },
        { icon: Shield, title: "Privacy & Security", desc: "Control your account security and data privacy." },
        { icon: Lock, title: "Change Password", desc: "Update your account password for better security." }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Customize your officer dashboard experience and account settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all border border-transparent hover:border-purple-200 dark:hover:border-purple-800">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl text-purple-500">
                                <section.icon className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-lg font-bold">{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{section.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
