"use client"

import { MessageSquare, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DetailedGrievancesPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Grievances</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all your submitted reports.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search grievances..." className="pl-9 w-64 h-11 rounded-xl" />
                    </div>
                    <Button variant="outline" className="h-11 rounded-xl gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-20 rounded-3xl border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">No grievances found</h3>
                <p className="text-slate-500 mt-2 max-w-md">You haven't submitted any grievances yet or none match your search criteria.</p>
                <Button className="mt-6">Raise New Grievance</Button>
            </div>
        </div>
    )
}
