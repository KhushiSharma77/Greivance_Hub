"use client"

import { useState, useEffect } from "react"
import {
    Users,
    Plus,
    Search,
    Loader2,
    Shield,
    User,
    Building2,
    MoreVertical,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api, ApiError } from "@/lib/api"

interface UserType {
    id: string
    name: string
    email: string
    role: "ADMIN" | "OFFICER" | "CITIZEN"
    departmentId?: string
    department?: {
        id: string
        name: string
        code: string
    }
}

interface Department {
    id: string
    name: string
    code: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([])
    const [departments, setDepartments] = useState<Department[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Create User State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "officer" as "officer" | "admin" })
    const [isCreating, setIsCreating] = useState(false)

    // Assign Department State
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("")
    const [isAssigning, setIsAssigning] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [usersResponse, deptsResponse] = await Promise.all([
                api.getAllUsers(),
                api.getAllDepartments()
            ])

            if (usersResponse.success) {
                setUsers(usersResponse.data)
            }
            if (deptsResponse.success) {
                setDepartments(deptsResponse.data)
            }
        } catch (err) {
            console.error(err)
            setError("Failed to load data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)
        setError(null)
        try {
            const response = await api.createUser(newUser)
            if (response.success) {
                setSuccessMessage("User created successfully")
                setNewUser({ name: "", email: "", password: "", role: "officer" })
                setIsCreateDialogOpen(false)
                fetchData()
                setTimeout(() => setSuccessMessage(null), 3000)
            } else {
                setError(response.message || "Failed to create user")
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to create user")
            }
        } finally {
            setIsCreating(false)
        }
    }

    const handleAssignDepartment = async () => {
        if (!selectedUser || !selectedDepartmentId) return

        setIsAssigning(true)
        setError(null)
        try {
            const response = await api.assignDepartmentToUser(selectedUser.id, selectedDepartmentId)
            if (response.success) {
                setSuccessMessage("Department assigned successfully")
                setIsAssignDialogOpen(false)
                setSelectedUser(null)
                setSelectedDepartmentId("")
                fetchData()
                setTimeout(() => setSuccessMessage(null), 3000)
            } else {
                setError(response.message || "Failed to assign department")
            }
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("Failed to assign department")
            }
        } finally {
            setIsAssigning(false)
        }
    }

    const openAssignDialog = (user: UserType) => {
        setSelectedUser(user)
        setSelectedDepartmentId(user.departmentId || "")
        setIsAssignDialogOpen(true)
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Users</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage system users and their roles.
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg shadow-purple-500/20">
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "officer" | "admin" })}
                                >
                                    <option value="officer">Officer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating} className="w-full bg-purple-600 hover:bg-purple-700">
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create User"
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
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-40 animate-pulse bg-slate-100 dark:bg-slate-800 border-none" />
                    ))}
                </div>
            ) : filteredUsers.length === 0 ? (
                <Card className="border-dashed border-2 bg-slate-50 dark:bg-slate-900/50">
                    <CardContent className="p-12 text-center">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No users found</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {searchQuery ? "Try adjusting your search query." : "Get started by creating a new user."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <Card key={user.id} className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${user.role === 'ADMIN' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
                                        {user.role === 'ADMIN' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button variant="ghost" size="icon" className="h-8 w-8" />
                                            }
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => openAssignDialog(user)}>
                                                <Building2 className="w-4 h-4 mr-2" />
                                                Assign Department
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{user.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>

                                <div className="flex items-center gap-2 text-xs font-medium">
                                    <span className={`px-2 py-1 rounded ${user.role === 'ADMIN' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'}`}>
                                        {user.role}
                                    </span>
                                    {user.department && (
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded flex items-center gap-1">
                                            <Building2 className="w-3 h-3" />
                                            {user.department.code}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Assign Department Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Department</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-slate-500">
                            Assigning department for <strong>{selectedUser?.name}</strong>
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="department">Select Department</Label>
                            <select
                                id="department"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedDepartmentId}
                                onChange={(e) => setSelectedDepartmentId(e.target.value)}
                            >
                                <option value="">Select a department...</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name} ({dept.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAssignDepartment} disabled={isAssigning || !selectedDepartmentId} className="bg-blue-600 hover:bg-blue-700">
                                {isAssigning ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Assigning...
                                    </>
                                ) : (
                                    "Assign Department"
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
