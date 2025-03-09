"use client"
import { useAuthContext } from "@/api/auth/useAuthContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, login, logout, me } = useAuthContext();
  const [appIsLoading, setAppIsLoading] = useState(true);


  useEffect(() => {
    me()
      .catch(() => { })
      .finally(() => setAppIsLoading(false));
  }, []);

  if (appIsLoading) {
    return <div>Loading...</div>;
  }
  else if (isAuthenticated) redirect("/home")
  return (

    <>

      {children}
    </>
  );
}
