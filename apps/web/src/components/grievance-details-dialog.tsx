"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Clock,
    MapPin,
    User,
    Building2,
    Calendar,
    FileText,
    Tag,
    TrendingUp,
    X,
    Image as ImageIcon,
} from "lucide-react"
import Image from "next/image"

interface Grievance {
    id: string
    originalText: string
    translatedText?: string | null
    category?: string | null
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
    priority?: "LOW" | "MEDIUM" | "HIGH"
    createdAt: string
    updatedAt: string
    imageUrl?: string | null
    latitude?: number | null
    longitude?: number | null
    user?: {
        id: string
        name: string
        email: string | null
        phone: string | null
    }
    department?: {
        id: string
        name: string
        City: string
    } | null
    assignedOfficer?: {
        id: string
        name: string
        email: string
    } | null
    aiMetadata?: {
        id: string
        category: string | null
        priority: string | null
        sentiment: string | null
        urgency: number | null
        keywords: any
        summary: string | null
    } | null
}

interface GrievanceDetailsDialogProps {
    grievance: Grievance | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function GrievanceDetailsDialog({
    grievance,
    open,
    onOpenChange,
}: GrievanceDetailsDialogProps) {
    const [imageOpen, setImageOpen] = useState(false)
    const [address, setAddress] = useState<string | null>(null)
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)

    useEffect(() => {
        if (grievance?.latitude && grievance?.longitude && open) {
            setIsLoadingAddress(true)
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${grievance.latitude}&lon=${grievance.longitude}`, {
                headers: {
                    'User-Agent': 'GrievanceHub/1.0'
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.display_name) {
                    setAddress(data.display_name)
                }
            })
            .catch(err => console.error("Error fetching address:", err))
            .finally(() => setIsLoadingAddress(false))
        } else if (!open) {
            setAddress(null)
        }
    }, [grievance?.latitude, grievance?.longitude, open])

    if (!grievance) return null

    const getStatusColor = (status: string) => {
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            case "LOW":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <FileText className="w-6 h-6 text-primary" />
                            Grievance Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information about your grievance
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Status and Priority */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={`${getStatusColor(grievance.status)} border-none px-3 py-1`}>
                                {grievance.status.replace("_", " ")}
                            </Badge>
                            {grievance.priority && (
                                <Badge className={`${getPriorityColor(grievance.priority)} border-none px-3 py-1`}>
                                    {grievance.priority} Priority
                                </Badge>
                            )}
                            <span className="text-sm text-slate-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Created {new Date(grievance.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>

                        {/* Image */}
                        {grievance.imageUrl && (
                            <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                                <div 
                                    className="relative w-full h-64 cursor-pointer"
                                    onClick={() => setImageOpen(true)}
                                >
                                    <Image
                                        src={grievance.imageUrl}
                                        alt="Grievance"
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Description
                            </h3>
                            <p className="text-slate-700 dark:text-slate-300 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl leading-relaxed">
                                {grievance.originalText}
                            </p>
                        </div>

                        {/* AI Analysis */}
                        {grievance.aiMetadata && (
                            <div className="space-y-3 p-4 bg-gradient-to-br from-primary/5 to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10 rounded-xl border border-primary/10">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    AI Analysis
                                </h3>
                                {grievance.aiMetadata.summary && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {grievance.aiMetadata.summary}
                                    </p>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    {grievance.aiMetadata.category && (
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                Category: <span className="font-medium text-slate-900 dark:text-white">{grievance.aiMetadata.category}</span>
                                            </span>
                                        </div>
                                    )}
                                    {grievance.aiMetadata.sentiment && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                Sentiment: <span className="font-medium text-slate-900 dark:text-white capitalize">{grievance.aiMetadata.sentiment}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Department and Officer Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {grievance.department && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Building2 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Department</span>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{grievance.department.name}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {grievance.department.City}
                                    </p>
                                </div>
                            )}

                            {grievance.assignedOfficer && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm font-medium">Assigned Officer</span>
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{grievance.assignedOfficer.name}</p>
                                    <p className="text-sm text-slate-500">{grievance.assignedOfficer.email}</p>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        {(grievance.latitude && grievance.longitude) && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm font-medium">Location</span>
                                </div>
                                <div className="w-full h-[200px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0" 
                                        scrolling="no" 
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${grievance.longitude-0.005},${grievance.latitude-0.005},${grievance.longitude+0.005},${grievance.latitude+0.005}&layer=mapnik&marker=${grievance.latitude},${grievance.longitude}`}
                                    ></iframe>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    {isLoadingAddress ? "Loading full address..." : address ? address : `Lat: ${grievance.latitude.toFixed(6)}, Long: ${grievance.longitude.toFixed(6)}`}
                                </p>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">Timeline</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Created</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {new Date(grievance.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Last Updated</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {new Date(grievance.updatedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Full Screen Image Modal */}
            {imageOpen && grievance.imageUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setImageOpen(false)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20"
                        onClick={() => setImageOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </Button>
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                        <Image
                            src={grievance.imageUrl}
                            alt="Grievance Full View"
                            fill
                            unoptimized
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    )
}
