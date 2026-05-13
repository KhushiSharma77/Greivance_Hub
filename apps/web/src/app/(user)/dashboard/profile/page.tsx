"use client"

import { useState, useEffect, useRef } from "react"
import { api, ApiError } from "@/lib/api"
import { toast } from "sonner"
import { Camera, User, Mail, Phone, MapPin, Shield, Loader2, Save, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface Profile {
    id: string
    name: string
    email: string | null
    phone: string | null
    profilePicture: string | null
    address: string | null
    aadhaarNumber: string | null
    isVerified: boolean
    createdAt: string
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Editable fields
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [aadhaarNumber, setAadhaarNumber] = useState("")

    useEffect(() => {
        fetchProfile()
    }, [])

    async function fetchProfile() {
        try {
            const res = await api.getProfile()
            setProfile(res.data)
            setName(res.data.name || "")
            setPhone(res.data.phone || "")
            setAddress(res.data.address || "")
            setAadhaarNumber(res.data.aadhaarNumber || "")
        } catch (err) {
            toast.error("Failed to load profile")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSave() {
        setIsSaving(true)
        try {
            const res = await api.updateProfile({ name, phone, address, aadhaarNumber })
            setProfile(res.data)
            toast.success("Profile updated successfully!")
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    async function handlePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const res = await api.uploadProfilePicture(file)
            setProfile(prev => prev ? { ...prev, profilePicture: res.data.profilePicture } : null)
            toast.success("Profile picture updated!")
        } catch (err) {
            toast.error("Failed to upload picture")
        } finally {
            setIsUploading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your personal information and profile picture.</p>
            </div>

            {/* Profile Picture Card */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-indigo-500">
                                {profile?.profilePicture ? (
                                    <Image
                                        src={profile.profilePicture}
                                        alt="Profile"
                                        width={112}
                                        height={112}
                                        unoptimized
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-12 h-12 text-white/80" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border-2 border-white dark:border-slate-700 hover:scale-110 transition-transform"
                            >
                                {isUploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                ) : (
                                    <Camera className="w-4 h-4 text-blue-500" />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePictureUpload}
                            />
                        </div>

                        {/* Name & Meta */}
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {profile?.name}
                            </h2>
                            <p className="text-slate-500 text-sm flex items-center gap-1 justify-center sm:justify-start mt-1">
                                <Mail className="w-3.5 h-3.5" />
                                {profile?.email || "No email"}
                            </p>
                            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                                {profile?.isVerified ? (
                                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-full">
                                        Unverified
                                    </span>
                                )}
                                <span className="text-xs text-slate-400">
                                    Member since {new Date(profile?.createdAt || "").toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Profile Card */}
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Full Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="rounded-xl"
                        />
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> Email
                        </Label>
                        <Input
                            value={profile?.email || ""}
                            disabled
                            className="rounded-xl bg-slate-50 dark:bg-slate-800/50"
                        />
                        <p className="text-xs text-slate-400">Email cannot be changed after registration.</p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> Phone Number
                        </Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="rounded-xl"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Address
                        </Label>
                        <Input
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your full address"
                            className="rounded-xl"
                        />
                    </div>

                    {/* Aadhaar */}
                    <div className="space-y-1.5">
                        <Label htmlFor="aadhaar" className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" /> Aadhaar Number
                        </Label>
                        <Input
                            id="aadhaar"
                            value={aadhaarNumber}
                            onChange={(e) => setAadhaarNumber(e.target.value)}
                            placeholder="XXXX XXXX XXXX"
                            maxLength={12}
                            className="rounded-xl"
                        />
                        <p className="text-xs text-slate-400">Your Aadhaar number is encrypted and stored securely.</p>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto rounded-xl gap-2 px-8"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
