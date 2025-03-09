"use client"
import { useAuthContext } from "@/api/auth/useAuthContext";
import { redirect } from 'next/navigation'

export default function ModLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role } = useAuthContext();
  if (role !== "MODERATOR") redirect("/not_found")
  return (
    <>
      {children}
    </>
  );
}
