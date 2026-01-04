"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
    Plus, 
    Search, 
    Filter, 
    Eye, 
    Pencil, 
    Trash2, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    TrendingUp,
    FileText,
    MapPin
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api, ApiError } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { GrievanceDetailsDialog } from "@/components/grievance-details-dialog"
import { EditGrievanceDialog } from "@/components/edit-grievance-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

interface Grievance {
    id: string;
    originalText: string;
    translatedText?: string | null;
    category?: string | null;
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
    priority?: "LOW" | "MEDIUM" | "HIGH";
    createdAt: string;
    updatedAt: string;
    imageUrl?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    user?: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
    };
    department?: {
        id: string;
        name: string;
        City: string;
    } | null;
    assignedOfficer?: {
        id: string;
        name: string;
        email: string;
    } | null;
    aiMetadata?: {
        id: string;
        category: string | null;
        priority: string | null;
        sentiment: string | null;
        urgency: number | null;
        keywords: any;
        summary: string | null;
    } | null;
}

export default function UserDashboard() {
    const [grievances, setGrievances] = useState<Grievance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await api.getGrievances()
            if (response.success) {
                setGrievances(response.data)
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to load your grievances.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleOperationSuccess = () => {
        fetchData()
    }

    const stats = [
        { 
            label: "Total Posted", 
            value: grievances.length, 
            icon: FileText, 
            color: "text-blue-500", 
            bg: "bg-blue-50 dark:bg-blue-950/30" 
        },
        { 
            label: "Pending", 
            value: grievances.filter(g => g.status === "PENDING").length, 
            icon: Clock, 
            color: "text-orange-500", 
            bg: "bg-orange-50 dark:bg-orange-950/30" 
        },
        { 
            label: "In Progress", 
            value: grievances.filter(g => g.status === "IN_PROGRESS").length, 
            icon: TrendingUp, 
            color: "text-purple-500", 
            bg: "bg-purple-50 dark:bg-purple-950/30" 
        },
        { 
            label: "Resolved", 
            value: grievances.filter(g => g.status === "RESOLVED").length, 
            icon: CheckCircle2, 
            color: "text-green-500", 
            bg: "bg-green-50 dark:bg-green-950/30" 
        }
    ]

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            case "RESOLVED":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            case "REJECTED":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Citizen Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and track your posted grievances in real-time.</p>
                </div>
                <Link href="/dashboard/new-grievance">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 rounded-2xl shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-5 h-5" />
                        <span>Raise New Grievance</span>
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden group hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">+2.4%</span>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{stat.value}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Grievances List */}
                <Card className="xl:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 px-6">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            Recent Issues
                            <span className="text-xs font-normal text-slate-400 ml-2">{grievances.length} total</span>
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input placeholder="Search issues..." className="pl-9 w-48 h-9 rounded-xl text-sm" />
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                            </div>
                        ) : error ? (
                            <div className="p-10 text-center">
                                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                                <p className="text-slate-500">{error}</p>
                            </div>
                        ) : grievances.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="p-4 bg-slate-100 dark:bg-slate-800 inline-block rounded-full mb-4 text-slate-400">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold">No issues raised yet</h3>
                                <p className="text-slate-500 mt-1 max-w-sm mx-auto">Feel free to report any problems and we'll help get them resolved as soon as possible.</p>
                                <Button className="mt-6">Submit Your First Issue</Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {grievances.map((grievance) => (
                                    <div key={grievance.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusStyles(grievance.status)}`}>
                                                        {grievance.status.replace("_", " ")}
                                                    </span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(grievance.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white truncate mb-1 pr-4">
                                                    {grievance.originalText}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp className="w-4 h-4" />
                                                        {grievance.category || "General"}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {grievance.department?.City ??
                                                            `${grievance.latitude}, ${grievance.longitude}`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl gap-2"
                                                    onClick={() => {
                                                        setSelectedGrievance(grievance)
                                                        setDetailsOpen(true)
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Button>
                                                {grievance.status === "PENDING" && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-xl gap-2"
                                                            onClick={() => {
                                                                setSelectedGrievance(grievance)
                                                                setEditOpen(true)
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-xl gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            onClick={() => {
                                                                setSelectedGrievance(grievance)
                                                                setDeleteOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Status Tracker / Sidebar Info */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-primary/10 to-blue-600/10 backdrop-blur-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Quick Status Tracker</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400 relative z-10">
                                Most of your issues are currently being processed by the municipal department.
                            </p>
                            <div className="space-y-4">
                                <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-white/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Average Resolution Time</span>
                                        <span className="text-xs font-bold text-primary">3.5 Days</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-primary rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-slate-500">Check our FAQ or talk straight to our support team.</p>
                            <Button variant="outline" className="w-full rounded-xl gap-2 font-semibold">
                                View Help Center
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialog Components */}
            <GrievanceDetailsDialog
                grievance={selectedGrievance}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
            <EditGrievanceDialog
                grievance={selectedGrievance}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSuccess={handleOperationSuccess}
            />
            <DeleteConfirmationDialog
                grievance={selectedGrievance}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onSuccess={handleOperationSuccess}
            />
        </div>
    )
}
