"use client"

import { useState, useEffect } from "react"
import { 
    ClipboardList, 
    Search, 
    Loader2, 
    MapPin, 
    Building2, 
    User as UserIcon,
    ArrowUpRight,
    Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api, ApiError } from "@/lib/api"
import Link from "next/link"

interface Grievance {
    id: string
    originalText: string
    category: string
    priority: "Low" | "Medium" | "High"
    status: string
    latitude: number
    longitude: number
    createdAt: string
    user: {
        name: string
        email: string
    }
    department?: {
        name: string
    }
    assignedOfficer?: {
        name: string
    }
}

export default function AdminComplaintsPage() {
    const [grievances, setGrievances] = useState<Grievance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchGrievances()
    }, [])

    const fetchGrievances = async () => {
        try {
            const response = await api.adminGetAllGrievances()
            if (response.success) {
                setGrievances(response.data)
            } else {
                setError(response.message || "Failed to load complaints")
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to load complaints")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            case 'ANALYZED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            case 'RESOLVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            case 'CLOSED': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-600 border-red-200 bg-red-50'
            case 'Medium': return 'text-amber-600 border-amber-200 bg-amber-50'
            case 'Low': return 'text-green-600 border-green-200 bg-green-50'
            default: return 'text-slate-600 border-slate-200 bg-slate-50'
        }
    }

    const filteredGrievances = grievances.filter(g => 
        g.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Complaints</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        System-wide overview of all citizen grievances.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                    </Button>
                    <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-600 bg-blue-50">
                        {grievances.length} Total
                    </Badge>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                <Input
                    placeholder="Search by text, category, user or department..."
                    className="pl-12 h-12 rounded-xl border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 normal-case shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table/Cards */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-500">Loading comprehensive complaints view...</p>
                </div>
            ) : error ? (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6 text-center text-red-600">
                        {error}
                    </CardContent>
                </Card>
            ) : filteredGrievances.length === 0 ? (
                <Card className="border-dashed border-2 bg-slate-50 dark:bg-slate-900/50">
                    <CardContent className="p-12 text-center">
                        <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No complaints found</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            No grievances match your current search criteria.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredGrievances.map((g) => (
                        <Card key={g.id} className="group hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden">
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 lg:grid-cols-4">
                                    {/* Column 1: Info & Text */}
                                    <div className="p-6 lg:col-span-2 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Badge variant="outline" className={`font-mono text-[10px] ${getPriorityColor(g.priority)}`}>
                                                {g.priority}
                                            </Badge>
                                            <span className="text-[11px] text-slate-400">
                                                {new Date(g.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                                            {g.originalText}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px]">
                                                {g.category || 'Uncategorized'}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                <MapPin className="w-3 h-3" />
                                                {g.latitude.toFixed(4)}, {g.longitude.toFixed(4)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Assignment */}
                                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Department</p>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        {g.department?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                    <UserIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Assigned Officer</p>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        {g.assignedOfficer?.name || <span className="text-slate-400 italic">No Officer Assigned</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Status & User */}
                                    <div className="p-6 flex flex-col justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Current Status</p>
                                            <Badge className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(g.status)}`}>
                                                {g.status}
                                            </Badge>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] text-slate-400 mb-1">Citizen</p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{g.user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{g.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
