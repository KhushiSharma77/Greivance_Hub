"use client"

import { useState, useEffect, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Upload, X, Mic, MicOff, Languages } from "lucide-react"
import { toast } from "sonner"
import { api, ApiError } from "@/lib/api"
import Image from "next/image"

interface Grievance {
    id: string
    originalText: string
    imageUrl?: string | null
}

interface EditGrievanceDialogProps {
    grievance: Grievance | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

const INDIAN_LANGUAGES = [
    { code: 'en-IN', name: 'English (India)' },
    { code: 'hi-IN', name: 'Hindi (हिन्दी)' },
    { code: 'bn-IN', name: 'Bengali (বাংলা)' },
    { code: 'te-IN', name: 'Telugu (తెలుగు)' },
    { code: 'mr-IN', name: 'Marathi (मराठी)' },
    { code: 'ta-IN', name: 'Tamil (தமிழ்)' },
    { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)' },
    { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ml-IN', name: 'Malayalam (മലയാളം)' },
];

export function EditGrievanceDialog({
    grievance,
    open,
    onOpenChange,
    onSuccess,
}: EditGrievanceDialogProps) {
    const [description, setDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isListening, setIsListening] = useState(false)
    const [selectedLang, setSelectedLang] = useState('en-IN')
    
    const recognitionRef = useRef<any>(null)

    // Setup voice recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true
            
            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result: any) => result.transcript)
                    .join('')
                setDescription(transcript)
            }

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error", event.error)
                setIsListening(false)
                toast.error("Speech recognition error: " + event.error)
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
            }
        }
    }, [])

    // Update form fields when dialog opens with grievance data
    useEffect(() => {
        if (open && grievance) {
            setDescription(grievance.originalText)
            setPreviewUrl(grievance.imageUrl || null)
            setSelectedFile(null)
            setError(null)
            setIsListening(false)
            // Stop any ongoing recognition
            if (recognitionRef.current && isListening) {
                recognitionRef.current.stop()
            }
        }
    }, [open, grievance])

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error("Speech recognition is not supported in this browser.")
            return
        }

        if (isListening) {
            recognitionRef.current.stop()
        } else {
            recognitionRef.current.lang = selectedLang
            recognitionRef.current.start()
            setIsListening(true)
            toast.info("Listening...", { duration: 2000 })
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB")
                return
            }
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleRemoveImage = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!grievance) return

        setError(null)
        setIsLoading(true)

        try {
            const formData = new FormData()
            const data = {
                originalText: description,
            }
            formData.append("data", JSON.stringify(data))

            if (selectedFile) {
                formData.append("photo", selectedFile)
            }

            await api.updateGrievance(grievance.id, formData)
            toast.success("Grievance updated successfully!")
            onSuccess()
            onOpenChange(false)
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
                toast.error(err.message)
            } else {
                setError("Failed to update grievance")
                toast.error("Failed to update grievance")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Grievance</DialogTitle>
                    <DialogDescription>
                        Update your grievance description and optionally change the image
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="description" className="text-base font-semibold">
                                Description *
                            </Label>
                            {/* Language Selector */}
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                                <Languages className="w-4 h-4 text-slate-500" />
                                <select 
                                    className="bg-transparent border-none text-xs font-bold outline-none cursor-pointer text-slate-700 dark:text-slate-300"
                                    value={selectedLang}
                                    onChange={(e) => setSelectedLang(e.target.value)}
                                >
                                    {INDIAN_LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="relative">
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full min-h-[150px] p-4 pr-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Describe your grievance in detail... Use your voice for faster typing!"
                                required
                                minLength={10}
                            />
                            <button 
                                type="button"
                                onClick={toggleListening}
                                className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 ${
                                    isListening 
                                        ? "bg-red-500 text-white animate-pulse" 
                                        : "bg-primary text-white"
                                }`}
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500">
                            {description.length} characters (minimum 10 required)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="photo" className="text-base font-semibold">
                            Photo (Optional)
                        </Label>
                        {previewUrl ? (
                            <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 group">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={previewUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={handleRemoveImage}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <label
                                htmlFor="photo"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary transition-colors bg-slate-50 dark:bg-slate-900/50"
                            >
                                <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                                    <Upload className="w-10 h-10" />
                                    <p className="text-sm font-medium">Click to upload image</p>
                                    <p className="text-xs">PNG, JPG up to 5MB</p>
                                </div>
                                <input
                                    id="photo"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}
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
                            type="submit"
                            disabled={isLoading || description.length < 10}
                            className="bg-primary hover:bg-primary/90 min-w-[120px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Grievance"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
