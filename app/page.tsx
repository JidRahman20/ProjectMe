"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DemplonLogo } from "@/components/ui/demplon-logo";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their home page
  useEffect(() => {
    if (!isLoading && user) {
      const roleMap: Record<string, string> = {
        'admin': '/admin', // admin ke admin dashboard
        'approval': '/approval',
        'pendor': '/pendor',
        'user': '/user',
      };
      const redirectTo = roleMap[user.role.toLowerCase()] || '/user';
      router.push(redirectTo);
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-center">
          <DemplonLogo className="w-32 h-32 mx-auto mb-4 animate-pulse" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <DemplonLogo className="w-48 h-48 mx-auto mb-8" standalone />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Portal Demplon
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Sistem manajemen internal untuk meningkatkan produktivitas dan kolaborasi tim
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Masuk ke Portal
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cepat & Efisien</h3>
            <p className="text-purple-100">
              Akses semua kebutuhan kerja dalam satu platform terintegrasi
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aman & Terpercaya</h3>
            <p className="text-purple-100">
              Data Anda terlindungi dengan sistem keamanan terbaik
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Kolaboratif</h3>
            <p className="text-purple-100">
              Tingkatkan kerja sama tim dengan tools yang powerful
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-6 text-center text-purple-200">
        <p>&copy; 2025 Demplon. All rights reserved.</p>
      </div>
    </div>
  );
}
