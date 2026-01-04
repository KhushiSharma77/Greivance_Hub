"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { api, ApiError } from "@/lib/api"

interface Grievance {
    id: string
    originalText: string
    status: string
}

interface DeleteConfirmationDialogProps {
    grievance: Grievance | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function DeleteConfirmationDialog({
    grievance,
    open,
    onOpenChange,
    onSuccess,
}: DeleteConfirmationDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!grievance) return

        setError(null)
        setIsLoading(true)

        try {
            await api.deleteGrievance(grievance.id)
            toast.success("Grievance deleted successfully!")
            onSuccess()
            onOpenChange(false)
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
                toast.error(err.message)
            } else {
                setError("Failed to delete grievance")
                toast.error("Failed to delete grievance")
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (!grievance) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Delete Grievance</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                    Are you sure you want to delete this grievance?
                                </p>
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    This will permanently remove the grievance and all associated data. This action cannot be reversed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Grievance Preview
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                            {grievance.originalText}
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
