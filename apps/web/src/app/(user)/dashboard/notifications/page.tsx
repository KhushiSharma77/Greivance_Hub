"use client"

import { Bell, Info } from "lucide-react"

export default function NotificationsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated with the latest status of your grievances.</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-20 rounded-3xl border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                    <Bell className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">No new notifications</h3>
                <p className="text-slate-500 mt-2 max-w-md">You're all caught up! Updates regarding your posted grievances will appear here.</p>
            </div>
        </div>
    )
}
