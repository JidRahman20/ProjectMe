"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user && allowedRoles && allowedRoles.length > 0) {
      // Check if user role is allowed
      const userRoleLower = user.role.toLowerCase();
      const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRoleLower);
      
      if (!isAllowed) {
        // Redirect to user's home page based on their role
        const roleHomeMap: Record<string, string> = {
          'approval': '/approval',
          'admin': '/admin', // admin ke admin dashboard
          'pendor': '/pendor',
          'user': '/user',
        };
        const userHome = roleHomeMap[userRoleLower] || '/user';
        
        // Only redirect if not already on their home page
        if (pathname !== userHome) {
          router.push(userHome);
        }
      }
    }
  }, [user, isLoading, router, allowedRoles, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
