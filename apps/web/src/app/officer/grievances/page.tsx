"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    MessageSquare,
    Filter,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    MapPin,
    ChevronRight,
    FileText,
    ChevronDown,
    ChevronUp,
    User,
    Calendar,
    Building2,
    Shield,
    AlertTriangle,
    Target,
    Brain,
    Languages,
    X,
    RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { api, ApiError } from "@/lib/api"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler
} from 'chart.js'
import { Bar, Doughnut, Radar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler
)

interface Grievance {
    id: string;
    originalText: string;
    translatedText?: string;
    category?: string;
    status: "PENDING" | "ANALYZED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    createdAt: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    latitude?: number;
    longitude?: number;
}

export default function OfficerGrievancesPage() {
    const [grievances, setGrievances] = useState<Grievance[]>([])
    const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(null)
    const [selectedGrievance, setSelectedGrievance] = useState<any>(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [statusUpdateGrievanceId, setStatusUpdateGrievanceId] = useState<string | null>(null)
    const [newStatus, setNewStatus] = useState<string>("")
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        filterGrievances()
    }, [searchQuery, statusFilter, grievances])

    const fetchData = async () => {
        try {
            const response = await api.getOfficerGrievances()
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
                setError("Failed to load grievances.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const fetchGrievanceDetails = async (grievanceId: string) => {
        setIsLoadingDetails(true)
        try {
            const response = await api.getOfficerGrievanceById(grievanceId)
            if (response.success) {
                setSelectedGrievance(response.data)
            } else {
                setError(response.message || "Failed to load grievance details")
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to load grievance details")
            }
        } finally {
            setIsLoadingDetails(false)
        }
    }

    const filterGrievances = () => {
        let filtered = grievances

        if (searchQuery) {
            filtered = filtered.filter(g =>
                g.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (g.category && g.category.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        if (statusFilter !== "ALL") {
            filtered = filtered.filter(g => g.status === statusFilter)
        }

        setFilteredGrievances(filtered)
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/10 dark:text-orange-400"
            case "ANALYZED":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400"
            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/10 dark:text-purple-400"
            case "RESOLVED":
                return "bg-green-100 text-green-700 dark:bg-green-900/10 dark:text-green-400"
            case "CLOSED":
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/10 dark:text-slate-400"
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
        }
    }

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case "Positive": return "text-green-600"
            case "Neutral": return "text-blue-600"
            case "Negative": return "text-red-600"
            default: return "text-slate-600"
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

    const handleUpdateStatus = (grievanceId: string, currentStatus: string) => {
        setStatusUpdateGrievanceId(grievanceId)
        setNewStatus(currentStatus)
        setIsStatusDialogOpen(true)
    }

    const confirmStatusUpdate = async () => {
        if (!statusUpdateGrievanceId || !newStatus) {
            console.log("Missing required fields:", { statusUpdateGrievanceId, newStatus })
            return
        }

        console.log("Updating status:", { grievanceId: statusUpdateGrievanceId, newStatus })
        setIsUpdatingStatus(true)
        setError(null)
        setSuccessMessage(null)
        try {
            const response = await api.updateGrievanceStatus(statusUpdateGrievanceId, newStatus)
            console.log("API Response:", response)

            if (response.success) {
                // Close the dialog first
                setIsStatusDialogOpen(false)

                // Show success message
                setSuccessMessage("Grievance status updated successfully!")

                // Refetch all grievances to ensure data consistency
                await fetchData()

                // Refresh the details if this grievance is currently selected
                if (selectedGrievanceId === statusUpdateGrievanceId) {
                    await fetchGrievanceDetails(statusUpdateGrievanceId)
                }

                // Reset state
                setStatusUpdateGrievanceId(null)
                setNewStatus("")

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000)
            } else {
                console.error("Update failed:", response.message)
                setError(response.message || "Failed to update status")
            }
        } catch (err) {
            console.error("Error updating status:", err)
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to update grievance status")
            }
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handleViewDetails = (grievanceId: string) => {
        if (selectedGrievanceId === grievanceId) {
            setSelectedGrievanceId(null)
            setSelectedGrievance(null)
        } else {
            setSelectedGrievanceId(grievanceId)
            fetchGrievanceDetails(grievanceId)
        }
    }

    // Enhanced chart with gradients
    const aiMetricsBarData = selectedGrievance?.aiMetadata ? {
        labels: ['Urgency', 'Severity', 'Confidence', 'Similarity'],
        datasets: [{
            label: 'AI Analysis Metrics',
            data: [
                selectedGrievance.aiMetadata.urgency || 0,
                selectedGrievance.aiMetadata.severity || 0,
                (selectedGrievance.aiMetadata.confidence || 0) * 10,
                (selectedGrievance.aiMetadata.similarityScore || 0) * 10
            ],
            backgroundColor: [
                'rgba(249, 115, 22, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)'
            ],
            borderColor: [
                'rgb(249, 115, 22)',
                'rgb(239, 68, 68)',
                'rgb(168, 85, 247)',
                'rgb(236, 72, 153)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
        }]
    } : null

    const priorityDoughnutData = selectedGrievance ? {
        labels: ['Urgency', 'Severity', 'Other Factors'],
        datasets: [{
            data: [
                selectedGrievance.aiMetadata?.urgency || 3,
                selectedGrievance.aiMetadata?.severity || 3,
                4
            ],
            backgroundColor: [
                'rgba(249, 115, 22, 0.8)',
                'rgba(220, 38, 38, 0.8)',
                'rgba(148, 163, 184, 0.8)'
            ],
            borderColor: [
                'rgb(249, 115, 22)',
                'rgb(220, 38, 38)',
                'rgb(148, 163, 184)'
            ],
            borderWidth: 2
        }]
    } : null

    const sentimentRadarData = selectedGrievance?.aiMetadata ? {
        labels: ['Urgency', 'Severity', 'Confidence', 'Priority', 'Impact'],
        datasets: [{
            label: 'AI Assessment',
            data: [
                selectedGrievance.aiMetadata.urgency || 0,
                selectedGrievance.aiMetadata.severity || 0,
                (selectedGrievance.aiMetadata.confidence || 0) * 10,
                selectedGrievance.priority === 'HIGH' ? 10 : selectedGrievance.priority === 'MEDIUM' ? 6 : 3,
                (selectedGrievance.aiMetadata.severity || 0) + (selectedGrievance.aiMetadata.urgency || 0) / 2
            ],
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            borderColor: 'rgb(168, 85, 247)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(236, 72, 153)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(236, 72, 153)'
        }]
    } : null

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                borderRadius: 8,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Success Message */}
            {successMessage && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
                    <Card className="border-green-200 bg-green-50 dark:bg-green-950/30 shadow-lg">
                        <CardContent className="p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                {successMessage}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
                    <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 shadow-lg">
                        <CardContent className="p-4 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Department Grievances</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        View and manage all grievances assigned to your department.
                        <span className="ml-2 font-semibold text-purple-600 dark:text-purple-400">
                            {filteredGrievances.length} {filteredGrievances.length === 1 ? 'grievance' : 'grievances'}
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search grievances..."
                            className="pl-9 w-64 h-11 rounded-xl"
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
                        <option value="ANALYZED">Analyzed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
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
                        <Button onClick={fetchData} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            ) : filteredGrievances.length === 0 ? (
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
                    <CardContent className="p-20 text-center">
                        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full inline-block mb-4">
                            <MessageSquare className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold">
                            {searchQuery || statusFilter !== "ALL" ? "No matching grievances" : "No grievances assigned"}
                        </h3>
                        <p className="text-slate-500 mt-2 max-w-md mx-auto">
                            {searchQuery || statusFilter !== "ALL"
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "No grievances are currently assigned to your department."}
                        </p>
                        {(searchQuery || statusFilter !== "ALL") && (
                            <Button
                                onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
                                variant="outline"
                                className="mt-6"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredGrievances.map((grievance) => (
                        <div key={grievance.id} className="space-y-4">
                            <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-md transition-all group">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusStyles(grievance.status)}`}>
                                                    {grievance.status.replace("_", " ")}
                                                </span>
                                                {getPriorityBadge(grievance.priority)}
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
                                                    {grievance.latitude}, {grievance.longitude}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/30 gap-2"
                                                onClick={() => handleViewDetails(grievance.id)}
                                            >
                                                {selectedGrievanceId === grievance.id ? (
                                                    <>
                                                        <ChevronUp className="w-4 h-4" />
                                                        Hide Details
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-4 h-4" />
                                                        View Details
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/30 gap-2"
                                                onClick={() => handleUpdateStatus(grievance.id, grievance.status)}
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                Update Status
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Expanded Details Section */}
                            {selectedGrievanceId === grievance.id && (
                                <Card className="border-2 border-purple-100 dark:border-purple-900 shadow-lg animate-in slide-in-from-top duration-300">
                                    <CardHeader className="border-b border-purple-100 dark:border-purple-800">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-purple-500" />
                                                Detailed Analysis & AI Insights
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedGrievanceId(null)
                                                    setSelectedGrievance(null)
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {isLoadingDetails ? (
                                            <div className="space-y-4">
                                                <Skeleton className="h-40 w-full" />
                                                <Skeleton className="h-60 w-full" />
                                            </div>
                                        ) : selectedGrievance ? (
                                            <div className="space-y-6">
                                                {/* Basic Info Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-slate-500" />
                                                        <div>
                                                            <p className="text-xs text-slate-500">Citizen</p>
                                                            <p className="text-sm font-semibold">{selectedGrievance.user?.name || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-500" />
                                                        <div>
                                                            <p className="text-xs text-slate-500">Created</p>
                                                            <p className="text-sm font-semibold">
                                                                {new Date(selectedGrievance.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-slate-500" />
                                                        <div>
                                                            <p className="text-xs text-slate-500">Department</p>
                                                            <p className="text-sm font-semibold">{selectedGrievance.department?.name || "Unassigned"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-slate-500" />
                                                        <div>
                                                            <p className="text-xs text-slate-500">Location</p>
                                                            <p className="text-sm font-semibold">
                                                                {selectedGrievance.latitude && selectedGrievance.longitude
                                                                    ? `${selectedGrievance.latitude.toFixed(2)}, ${selectedGrievance.longitude.toFixed(2)}`
                                                                    : "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* AI Metadata Section */}
                                                {selectedGrievance.aiMetadata && (
                                                    <>
                                                        {/* AI Metrics Cards */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200">
                                                                <CardContent className="pt-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-3 bg-orange-500 rounded-lg">
                                                                            <AlertTriangle className="w-5 h-5 text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Urgency</p>
                                                                            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                                                                {selectedGrievance.aiMetadata.urgency}/10
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200">
                                                                <CardContent className="pt-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-3 bg-red-500 rounded-lg">
                                                                            <Target className="w-5 h-5 text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">Severity</p>
                                                                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                                                                {selectedGrievance.aiMetadata.severity}/10
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200">
                                                                <CardContent className="pt-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-3 bg-purple-500 rounded-lg">
                                                                            <Brain className="w-5 h-5 text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Confidence</p>
                                                                            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                                                                {((selectedGrievance.aiMetadata.confidence || 0) * 100).toFixed(0)}%
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20 border-pink-200">
                                                                <CardContent className="pt-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-3 bg-pink-500 rounded-lg">
                                                                            <TrendingUp className="w-5 h-5 text-white" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">Sentiment</p>
                                                                            <p className={`text-xl font-bold ${getSentimentColor(selectedGrievance.aiMetadata.sentiment)}`}>
                                                                                {selectedGrievance.aiMetadata.sentiment || "N/A"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>

                                                        {/* Charts and Text Section */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            {/* Bar Chart */}
                                                            <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                                                                <CardHeader>
                                                                    <CardTitle className="text-sm flex items-center gap-2">
                                                                        <Brain className="w-4 h-4 text-purple-500" />
                                                                        AI Metrics Overview
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="h-64">
                                                                        {aiMetricsBarData && (
                                                                            <Bar data={aiMetricsBarData} options={chartOptions} />
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            {/* Doughnut Chart */}
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-sm">Priority Breakdown</CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="h-64 flex items-center justify-center">
                                                                        {priorityDoughnutData && (
                                                                            <Doughnut data={priorityDoughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            {/* Radar Chart */}
                                                            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-800">
                                                                <CardHeader>
                                                                    <CardTitle className="text-sm flex items-center gap-2">
                                                                        <Target className="w-4 h-4 text-purple-500" />
                                                                        AI Assessment Radar
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <div className="h-64 flex items-center justify-center">
                                                                        {sentimentRadarData && (
                                                                            <Radar data={sentimentRadarData} options={{ responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 10 } } }} />
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Image if available */}
                                                {selectedGrievance.imageUrl && (
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle className="text-sm">Attached Image</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <img
                                                                src={selectedGrievance.imageUrl}
                                                                alt="Grievance"
                                                                className="w-full max-h-96 object-contain rounded-lg"
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </div>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Status Update Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-purple-500" />
                            Update Grievance Status
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Select the new status for this grievance:
                        </p>
                        <div className="space-y-2">
                            {["PENDING", "ANALYZED", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setNewStatus(status)}
                                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${newStatus === status
                                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                                        : "border-slate-200 dark:border-slate-700 hover:border-purple-300"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-semibold ${getStatusStyles(status)}`}>
                                            {status.replace("_", " ")}
                                        </span>
                                        {newStatus === status && (
                                            <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsStatusDialogOpen(false)}
                            disabled={isUpdatingStatus}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmStatusUpdate}
                            disabled={isUpdatingStatus || !newStatus}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
                        >
                            {isUpdatingStatus ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Status"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
