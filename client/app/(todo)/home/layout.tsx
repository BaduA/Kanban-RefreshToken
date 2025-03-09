"use client"
import { useAuthContext } from "@/api/auth/useAuthContext";
import { redirect } from 'next/navigation'

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {  role } = useAuthContext();


 
if (role === "ADMIN") redirect("/admin")
  else if (role === "MODERATOR") redirect("/moderator")
  return (
    <>
      {children}
    </>
  );
}
