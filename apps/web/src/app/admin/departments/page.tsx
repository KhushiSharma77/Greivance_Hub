"use client"

import { useState, useEffect } from "react"
import {
    Building2,
    Plus,
    Search,
    Loader2,
    AlertCircle,
    CheckCircle2,
    User as UserIcon,
    Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { api, ApiError } from "@/lib/api"

interface Department {
    id: string
    name: string
    code: string
    createdAt: string
    updatedAt: string
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([])
    const [newDepartment, setNewDepartment] = useState({ name: "", code: "", city: "" })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [departmentOfficers, setDepartmentOfficers] = useState<{ id: string; name: string; email: string; departmentId?: string }[]>([])
    const [officers, setOfficers] = useState<{ id: string; name: string; email: string; departmentId?: string }[]>([])
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
    const [assignmentData, setAssignmentData] = useState({ officerId: "" })
    const [isAssigning, setIsAssigning] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    useEffect(() => {
        fetchDepartments()
        fetchOfficers()
    }, [])

    const fetchOfficers = async () => {
        try {
            const response = await api.getAllUsers()
            if (response.success) {
                console.log(response.data);
                // Filter only officers
                const officerList = response.data.filter((user: any) => user.role === 'officer')
                setOfficers(officerList)
            }
        } catch (err) {
            console.error("Failed to fetch officers", err)
        }
    }

    const fetchDepartments = async () => {
        try {
            const response = await api.getAllDepartments()
            if (response.success) {
                setDepartments(response.data)
            } else {
                setError(response.message || "Failed to load departments")
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to load departments")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const fetchDepartmentOfficers = async (deptId: string) => {
        try {
            const response = await api.getDepartmentOfficers(deptId)
            if (response.success) {
                setDepartmentOfficers(response.data)
            }
        } catch (err) {
            console.error("Failed to fetch department officers", err)
        }
    }

    const handleCreateDepartment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newDepartment.name || !newDepartment.code || !newDepartment.city) return

        setIsCreating(true)
        setError(null)
        try {
            const response = await api.createDepartment(newDepartment)
            if (response.success) {
                setSuccessMessage("Department created successfully")
                setNewDepartment({ name: "", code: "", city: "" })
                setIsCreateDialogOpen(false)
                fetchDepartments()
                setTimeout(() => setSuccessMessage(null), 3000)
            } else {
                setError(response.message || "Failed to create department")
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to create department")
            }
        } finally {
            setIsCreating(false)
        }
    }

    const handleAssignOfficer = async (officerId: string) => {
        if (!selectedDepartment) return

        setIsAssigning(true)
        setError(null)
        try {
            const response = await api.assignOfficerToDepartment(
                selectedDepartment.id,
                officerId
            )
            if (response.success) {
                setSuccessMessage("Officer assigned successfully")
                // Refresh lists
                fetchDepartmentOfficers(selectedDepartment.id)
                fetchOfficers() // To update 'Reassign' status if needed
                setTimeout(() => setSuccessMessage(null), 3000)
            } else {
                setError(response.message || "Failed to assign officer")
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to assign officer")
            }
        } finally {
            setIsAssigning(false)
        }
    }

    const handleRemoveOfficer = async (officerId: string) => {
        if (!selectedDepartment) return

        setIsAssigning(true) // Reuse loading state
        try {
            const response = await api.removeOfficerFromDepartment(selectedDepartment.id, officerId)
            if (response.success) {
                setSuccessMessage("Officer removed successfully")
                fetchDepartmentOfficers(selectedDepartment.id)
                fetchOfficers()
                setTimeout(() => setSuccessMessage(null), 3000)
            }
        } catch (err) {
            console.error("Failed to remove officer", err)
            setError("Failed to remove officer")
        } finally {
            setIsAssigning(false)
        }
    }

    const openAssignDialog = (dept: Department) => {
        setSelectedDepartment(dept)
        setIsAssignDialogOpen(true)
        fetchDepartmentOfficers(dept.id)
        // Set default city if department has one (assuming department object might have city in future, or just empty for now)
        setAssignmentData({ officerId: "" })
    }

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

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

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Departments</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage organization departments and codes.
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white shadow-lg shadow-blue-500/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Department</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateDepartment} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Public Works"
                                    value={newDepartment.name}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Department Code</Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. PWD"
                                    value={newDepartment.code}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value.toUpperCase() })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    placeholder="e.g. New York"
                                    value={newDepartment.city}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, city: e.target.value })}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating} className="w-full bg-blue-600 hover:bg-blue-700">
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Department"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search departments..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-32 animate-pulse bg-slate-100 dark:bg-slate-800 border-none" />
                    ))}
                </div>
            ) : filteredDepartments.length === 0 ? (
                <Card className="border-dashed border-2 bg-slate-50 dark:bg-slate-900/50">
                    <CardContent className="p-12 text-center">
                        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No departments found</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {searchQuery ? "Try adjusting your search query." : "Get started by creating a new department."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepartments.map((dept) => (
                        <Card key={dept.id} className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                                        {dept.code}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{dept.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    Created {new Date(dept.createdAt).toLocaleDateString()}
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                    onClick={() => openAssignDialog(dept)}
                                >
                                    Assign Officer
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Assign Officer Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Manage Officers - {selectedDepartment?.name}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Current Officers Section */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Current Officers
                            </h3>
                            {departmentOfficers.length == 0 ? (
                                <p className="text-sm text-slate-500 italic">No officers assigned to this department.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {departmentOfficers.map((officer) => (
                                        <div key={officer.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                    <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-slate-900 dark:text-white">{officer.name}</p>
                                                    <p className="text-xs text-slate-500">{officer.email}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                onClick={() => handleRemoveOfficer(officer.id)}
                                                disabled={isAssigning}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800" />

                        {/* Available Officers Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Available Officers
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {officers
                                    .filter(o => !departmentOfficers.find(doff => doff.id === o.id))
                                    .map((officer) => (
                                        <Card key={officer.id} className="border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer group">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                                        <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                                    </div>
                                                    {officer.departmentId && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                                            Reassign
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{officer.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{officer.email}</p>
                                                </div>
                                                <Button
                                                    className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-colors"
                                                    size="sm"
                                                    onClick={() => handleAssignOfficer(officer.id)}
                                                    disabled={isAssigning}
                                                >
                                                    {isAssigning ? <Loader2 className="w-3 h-3 animate-spin" /> : "Assign"}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
