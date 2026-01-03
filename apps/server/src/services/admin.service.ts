import prisma from "@team-call-of-code/db";
import { ValidationError, NotFoundError } from "../lib/error-handler";
import { hashPassword } from "./auth.service";
import type { CreateDepartmentData, CreateUserData } from "../types/admin.types";

/**
 * Create a new department
 */
export async function createDepartment(data: CreateDepartmentData) {
    // Check if department with same name and city already exists
    const existingDepartment = await prisma.department.findFirst({
        where: {
            name: data.name,
            City: data.City,
        },
    });

    if (existingDepartment) {
        throw new ValidationError("Department with this name and city already exists");
    }

    const department = await prisma.department.create({
        data: {
            name: data.name,
            City: data.City,
        },
    });

    return department;
}

/**
 * Get all departments
 */
export async function getAllDepartments() {
    const departments = await prisma.department.findMany({
        include: {
            _count: {
                select: {
                    users: true,
                    grievances: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return departments;
}

/**
 * Create a new user (officer or admin)
 */
export async function createUser(data: CreateUserData) {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.email || undefined },
                { phone: data.phone || undefined },
            ],
        },
    });

    if (existingUser) {
        throw new ValidationError("User with this email or phone already exists");
    }

    // If departmentId is provided, verify it exists
    if (data.departmentId) {
        const department = await prisma.department.findUnique({
            where: { id: data.departmentId },
        });

        if (!department) {
            throw new NotFoundError("Department not found");
        }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            password: hashedPassword,
            role: data.role,
            departmentId: data.departmentId || null,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            departmentId: true,
            department: {
                select: {
                    id: true,
                    name: true,
                    City: true,
                },
            },
            createdAt: true,
        },
    });

    return user;
}

/**
 * Get all users (officers and admins)
 */
export async function getAllUsers() {
    const users = await prisma.user.findMany({
        where: {
            role: {
                in: ["officer", "admin"],
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            departmentId: true,
            department: {
                select: {
                    id: true,
                    name: true,
                    City: true,
                },
            },
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return users;
}

/**
 * Assign department to user
 */
export async function assignDepartmentToUser(userId: string, departmentId: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
        where: { id: departmentId },
    });

    if (!department) {
        throw new NotFoundError("Department not found");
    }

    // Update user's department
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            departmentId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            departmentId: true,
            department: {
                select: {
                    id: true,
                    name: true,
                    City: true,
                },
            },
        },
    });

    return updatedUser;
}
