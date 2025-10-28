"use client";

import Link from "next/link";
import { DemplonLogo } from "@/components/ui/demplon-logo";
import { 
  Shield, 
  Zap, 
  Users, 
  FileText,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function WelcomePage() {
  const features = [
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Keamanan data terjamin dengan enkripsi tingkat tinggi",
    },
    {
      icon: Zap,
      title: "Cepat & Efisien",
      description: "Interface yang responsif dan performa yang optimal",
    },
    {
      icon: Users,
      title: "Kolaborasi Tim",
      description: "Bekerja bersama tim dengan mudah dan efektif",
    },
    {
      icon: FileText,
      title: "Manajemen Dokumen",
      description: "Kelola semua dokumen Anda dalam satu tempat",
    },
  ];

  const benefits = [
    "Absensi online real-time",
    "Manajemen konsumsi karyawan",
    "Library dokumen perusahaan",
    "Portal karyawan terintegrasi",
    "Sistem peraturan digital",
    "Work area management",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <DemplonLogo className="w-10 h-10" standalone />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                DEMPLON
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <DemplonLogo className="w-32 h-32 animate-bounce-slow" standalone />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Selamat Datang di{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              DEMPLON
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Sistem Informasi Master untuk manajemen perusahaan yang modern, 
            efisien, dan terintegrasi. Kelola semua kebutuhan HR dan operasional 
            dalam satu platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Mulai Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 border-2 border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Fitur Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Kenapa Memilih DEMPLON?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Platform all-in-one untuk semua kebutuhan manajemen perusahaan Anda. 
                Hemat waktu, tingkatkan produktivitas, dan fokus pada pertumbuhan bisnis.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Coba Gratis Sekarang
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap untuk Memulai?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan perusahaan yang telah mempercayai DEMPLON 
            untuk mengelola operasional mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-green-600 bg-white hover:bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Daftar Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <DemplonLogo className="w-8 h-8" standalone />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DEMPLON
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 DEMPLON. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
