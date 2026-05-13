"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ThumbsUp, MessageSquare, MapPin, Loader2, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { toast } from "sonner"
import { api } from "@/lib/api"

// Type matches backend payload
type FeedGrievance = {
    id: string;
    originalText: string;
    imageUrl?: string;
    status: string;
    priority?: "High" | "Medium" | "Low";
    category?: string;
    createdAt: string;
    user: { name: string };
    department?: { name: string, City: string };
    _count: { upvotes: number, comments: number };
}

export default function FeedPage() {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['feed'],
        queryFn: () => api.getFeed(),
    })

    const upvoteMutation = useMutation({
        mutationFn: (id: string) => api.toggleUpvote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feed'] })
        }
    })

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin" /></div>

    const grievances: FeedGrievance[] = data?.data || []

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Community Feed</h1>
                <p className="text-slate-500">See what issues your community is facing and upvote them for visibility.</p>
            </div>

            <div className="space-y-6">
                {grievances.map(g => (
                    <Card key={g.id} className="overflow-hidden shadow-sm">
                        <CardHeader className="flex flex-row justify-between items-start pb-4">
                            <div className="space-y-2">
                                <CardTitle className="text-lg flex flex-wrap items-center gap-2">
                                    <span className="font-bold">{g.category || "General"} Issue</span>
                                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">{g.status}</span>
                                    {g.priority && (
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                            g.priority === 'High' ? 'bg-red-100 text-red-600 border border-red-200' :
                                            g.priority === 'Medium' ? 'bg-amber-100 text-amber-600 border border-amber-200' :
                                            'bg-blue-100 text-blue-600 border border-blue-200'
                                        }`}>
                                            {g.priority} Priority
                                        </span>
                                    )}
                                </CardTitle>
                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                    <span>By {g.user.name}</span>
                                    {g.department && (
                                        <>
                                            <span>•</span>
                                            <MapPin className="w-3 h-3" />
                                            <span>{g.department.City}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs text-slate-400">
                                {new Date(g.createdAt).toLocaleDateString()}
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">{g.originalText}</p>
                            
                            {g.imageUrl && (
                                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 border border-slate-100">
                                    <Image 
                                        src={g.imageUrl} 
                                        alt="Evidence" 
                                        fill 
                                        unoptimized
                                        className="object-cover" 
                                    />
                                </div>
                            )}
                            
                            {g.department && (
                                <div className="text-xs font-semibold text-primary/80 bg-primary/5 p-2 rounded-lg inline-block">
                                    Assigned to: {g.department.name}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 p-4 flex gap-4">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2 rounded-full hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                                onClick={() => upvoteMutation.mutate(g.id)}
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span className="font-bold">{g._count.upvotes}</span>
                                <span className="hidden sm:inline">Upvotes</span>
                            </Button>
                            
                            <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                                <MessageSquare className="w-4 h-4" />
                                <span className="font-bold">{g._count.comments}</span>
                                <span className="hidden sm:inline">Comments</span>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                
                {grievances.length === 0 && (
                    <div className="text-center p-12 text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed">
                        No public grievances found in the feed.
                    </div>
                )}
            </div>
        </div>
    )
}
