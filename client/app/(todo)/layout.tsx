"use client"
import { useAuthContext } from "@/api/auth/useAuthContext";
import { Button } from "@/components/ui/button";
import { redirect } from 'next/navigation'
import { useEffect, useState } from "react";


export default function TodoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, login, logout, me, role } = useAuthContext();
  const [appIsLoading, setAppIsLoading] = useState(true);
  useEffect(() => {
    me()
      .catch(() => { })
      .finally(() => setAppIsLoading(false));
  }, []);

  if (appIsLoading) {
    return <div>Loading...</div>;
  }
  else if (!isAuthenticated) redirect("/")
  // else if (role === "ADMIN") redirect("/admin")
  // else if (role === "USER") redirect("/home")
  // else if (role === "MODERATOR") redirect("/mod")
  return (
    <>
      <div className="w-full px-20 py-5 flex items-center justify-between bg-black text-white">
        <h1>TodoApp</h1>
        <Button onClick={() => { logout() }}>Logout</Button>
      </div>
      {children}
    </>
  );
}
