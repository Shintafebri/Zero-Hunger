"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, MapPin, Users, TrendingUp, LogOut, Map } from "lucide-react"

interface DonationProgram {
  id: number
  title: string
  description: string
  target_amount: number
  current_amount: number
  location: string
  status: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [programs, setPrograms] = useState<DonationProgram[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))

    // Load donation programs - dalam XAMPP akan fetch dari PHP API
    const mockPrograms: DonationProgram[] = [
      {
        id: 1,
        title: "Bantuan Pangan Daerah Terpencil Sumatra",
        description:
          "Program bantuan pangan untuk masyarakat di daerah terpencil Sumatra yang kesulitan akses makanan bergizi.",
        target_amount: 50000000,
        current_amount: 32500000,
        location: "Sumatra Utara",
        status: "active",
        created_at: "2024-01-15",
      },
      {
        id: 2,
        title: "Gizi Anak Sekolah Papua",
        description:
          "Program pemberian makanan bergizi untuk anak-anak sekolah di Papua guna mendukung tumbuh kembang optimal.",
        target_amount: 75000000,
        current_amount: 45000000,
        location: "Papua",
        status: "active",
        created_at: "2024-01-10",
      },
      {
        id: 3,
        title: "Pemberdayaan Petani Lokal Jawa Tengah",
        description:
          "Program pemberdayaan petani lokal dengan teknologi pertanian modern untuk meningkatkan hasil panen.",
        target_amount: 100000000,
        current_amount: 100000000,
        location: "Jawa Tengah",
        status: "completed",
        created_at: "2023-12-01",
      },
    ]

    setPrograms(mockPrograms)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p>Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Selamat datang, {user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Program</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{programs.length}</div>
              <p className="text-xs text-muted-foreground">Program donasi aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donasi</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(programs.reduce((sum, p) => sum + p.current_amount, 0))}
              </div>
              <p className="text-xs text-muted-foreground">Terkumpul dari semua program</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lokasi Terjangkau</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(programs.map((p) => p.location)).size}</div>
              <p className="text-xs text-muted-foreground">Provinsi di Indonesia</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Program Donasi</h2>
          <div className="flex space-x-2">
            <Link href="/maps">
              <Button variant="outline">
                <Map className="h-4 w-4 mr-2" />
                Lihat Peta
              </Button>
            </Link>
            <Link href="/donate">
              <Button>
                <Heart className="h-4 w-4 mr-2" />
                Donasi Sekarang
              </Button>
            </Link>
            <Link href="/programs/create">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Buat Program
              </Button>
            </Link>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={program.status === "active" ? "default" : "secondary"}>
                    {program.status === "active" ? "Aktif" : "Selesai"}
                  </Badge>
                  <span className="text-sm text-gray-500">{program.created_at}</span>
                </div>
                <CardTitle className="text-lg">{program.title}</CardTitle>
                <CardDescription className="text-sm">{program.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {program.location}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{getProgressPercentage(program.current_amount, program.target_amount).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(program.current_amount, program.target_amount)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{formatCurrency(program.current_amount)}</span>
                      <span className="text-gray-600">dari {formatCurrency(program.target_amount)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/programs/${program.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Detail
                      </Button>
                    </Link>
                    {program.status === "active" && (
                      <Link href={`/donate?program=${program.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          Donasi
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
