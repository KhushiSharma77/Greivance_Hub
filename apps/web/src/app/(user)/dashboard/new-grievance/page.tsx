"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
    Camera, 
    Mic, 
    MicOff, 
    MapPin, 
    Image as ImageIcon, 
    X, 
    Loader2, 
    ChevronLeft,
    CheckCircle2,
    Languages
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"

// Speech Recognition Types for TS
interface SpeechRecognitionEvent extends Event {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
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

export default function NewGrievancePage() {
    const router = useRouter()
    const [originalText, setOriginalText] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [isLocating, setIsLocating] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedLang, setSelectedLang] = useState('en-IN')
    
    // Voice Recognition Ref
    const recognitionRef = useRef<any>(null)

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
                setOriginalText(transcript)
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const detectLocation = () => {
        setIsLocating(true)
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                    setIsLocating(false)
                    toast.success("Location captured!")
                },
                (error) => {
                    console.error("Location Error", error)
                    setIsLocating(false)
                    toast.error("Could not get location. Please enable GPS.")
                }
            )
        } else {
            setIsLocating(false)
            toast.error("Geolocation not supported.")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (originalText.length < 10) {
            toast.error("Description must be at least 10 characters.")
            return
        }

        setIsSubmitting(true)
        try {
            // Using the schema fields: originalText, latitude, longitude, imageUrl (string)
            // Note: Since backend file handling is "later", we send data with an empty imageUrl or handle it as a placeholder.
            const payload = {
                originalText,
                latitude: location?.lat,
                longitude: location?.lng,
                imageUrl: imagePreview // Temporary using base64 for now if backend doesn't handle multipart yet, or just null
            }

            const response = await api.createGrievance(payload)
            if (response.success) {
                toast.success("Grievance submitted successfully!")
                router.push("/dashboard")
            }
        } catch (err) {
            if (err instanceof ApiError) {
                toast.error(err.message)
            } else {
                toast.error("Something went wrong. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-10 w-10"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Raise New Grievance</h1>
                    <p className="text-slate-500 dark:text-slate-400">Provide details about the issue to help us resolve it faster.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                {/* Left Column: Media & Location */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Image Upload */}
                    <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Evidence Photo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {imagePreview ? (
                                <div className="relative group rounded-2xl overflow-hidden border-2 border-primary/20 aspect-square">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <button 
                                        type="button"
                                        onClick={() => { setImage(null); setImagePreview(null); }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Camera className="w-8 h-8" />
                                    </div>
                                    <span className="mt-3 text-xs font-semibold text-slate-500">Click to capture or upload</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            )}
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full h-12 rounded-xl gap-2 font-semibold border-2 hover:bg-slate-50"
                                onClick={detectLocation}
                                disabled={isLocating}
                            >
                                {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5 text-primary" />}
                                {location ? "Location Captured" : "Detect Current Location"}
                            </Button>
                            {location && (
                                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/50 flex items-center justify-between">
                                    <span className="text-xs font-mono text-green-700 dark:text-green-400">
                                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                    </span>
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Description & Voice */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm h-full">
                        <CardHeader className="pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Issue Description</CardTitle>
                            
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
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative">
                                <textarea 
                                    className="w-full min-h-[300px] p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-primary/30 outline-none transition-all resize-none text-lg leading-relaxed dark:text-white"
                                    placeholder="Describe your issue in detail... Use your voice for faster typing!"
                                    value={originalText}
                                    onChange={(e) => setOriginalText(e.target.value)}
                                    required
                                />
                                
                                <button 
                                    type="button"
                                    onClick={toggleListening}
                                    className={`absolute bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 ${
                                        isListening 
                                            ? "bg-red-500 text-white animate-pulse" 
                                            : "bg-primary text-white"
                                    }`}
                                >
                                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div className="flex gap-2">
                                    <span className="text-xs text-slate-400 font-medium">Minimum 10 characters</span>
                                    <span className={`text-xs font-bold ${originalText.length >= 10 ? 'text-green-500' : 'text-slate-400'}`}>
                                        ({originalText.length})
                                    </span>
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-12 rounded-xl shadow-lg shadow-primary/20 font-bold gap-2 transition-all hover:translate-y-[-2px]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Grievance"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}
