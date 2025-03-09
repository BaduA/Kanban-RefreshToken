"use client"
import { useAuthContext } from "@/api/auth/useAuthContext";
import { redirect } from 'next/navigation'

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { role } = useAuthContext();



    if (role !== "ADMIN") redirect("/not_found")

    return (
        <>
            {children}
        </>
    );
}
