"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    MessageSquare,
    Filter,
    Search,
    Eye,
    Pencil,
    Trash2,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    MapPin,
    FileText,
    Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api, ApiError } from "@/lib/api"
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

export default function CitizenGrievancesPage() {
    const [grievances, setGrievances] = useState<Grievance[]>([])
    const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        filterGrievances()
    }, [searchQuery, statusFilter, grievances])

    const fetchData = async () => {
        try {
            const response = await api.getGrievances()
            if (response.success) {
                setGrievances(response.data)
                setFilteredGrievances(response.data)
            } else {
                setError(response.message || "Failed to load grievances")
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

    const filterGrievances = () => {
        let filtered = grievances

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(g =>
                g.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (g.category && g.category.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        // Filter by status
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(g => g.status === statusFilter)
        }

        setFilteredGrievances(filtered)
    }

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

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">High Priority</span>
            case "MEDIUM":
                return <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">Medium</span>
            case "LOW":
                return <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">Low</span>
            default:
                return null
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Grievances</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        View and manage all your submitted reports.
                        <span className="ml-2 font-semibold text-primary">
                            {filteredGrievances.length} {filteredGrievances.length === 1 ? 'grievance' : 'grievances'}
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/new-grievance">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl gap-2 shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" />
                            New Grievance
                        </Button>
                    </Link>
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

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search grievances..."
                        className="pl-9 h-11 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium"
                >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                    ))}
                </div>
            ) : error ? (
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
                    <CardContent className="p-20 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Error Loading Grievances</h3>
                        <p className="text-slate-500 mb-6">{error}</p>
                        <Button onClick={fetchData} className="bg-primary hover:bg-primary/90">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            ) : filteredGrievances.length === 0 ? (
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
                    <CardContent className="p-20 text-center">
                        <div className="p-4 bg-primary/10 rounded-full inline-block mb-4 text-primary">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">
                            {searchQuery || statusFilter !== "ALL" ? "No matching grievances" : "No grievances yet"}
                        </h3>
                        <p className="text-slate-500 mt-2 max-w-md mx-auto">
                            {searchQuery || statusFilter !== "ALL"
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "You haven't submitted any grievances yet. Start by raising your first grievance."}
                        </p>
                        {searchQuery || statusFilter !== "ALL" ? (
                            <Button
                                onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
                                variant="outline"
                                className="mt-6"
                            >
                                Clear Filters
                            </Button>
                        ) : (
                            <Link href="/dashboard/new-grievance">
                                <Button className="mt-6 bg-primary hover:bg-primary/90">
                                    Raise New Grievance
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredGrievances.map((grievance) => (
                        <Card key={grievance.id} className="border-none shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-md transition-all group cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusStyles(grievance.status)}`}>
                                                {grievance.status.replace("_", " ")}
                                            </span>
                                            {grievance.priority && getPriorityBadge(grievance.priority)}
                                            <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                                                <Clock className="w-3 h-3" />
                                                {new Date(grievance.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
