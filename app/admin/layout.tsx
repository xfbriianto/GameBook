"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users } from "lucide-react"

interface User {
  id: number;
  username: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      if (user.role === "admin") {
        setIsAuthorized(true);
      } else {
        // Logged in but not an admin
        alert("You are not authorized to access this page.");
        router.replace("/");
      }
    } else {
      // Not logged in
      router.replace("/login");
    }
  }, [router]);

  // Render a loading state or null while checking authorization
  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // If authorized, render the actual admin page content
  return (
    <>
      {children}
    </>
  );
}
