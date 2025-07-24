"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, Filter, Users, TrendingDown, Heart, Navigation, Layers } from "lucide-react"
import InteractiveMap from "@/components/interactive-map"
import MapsIntegration from "@/components/maps-integration"

interface ProgramLocation {
  id: number
  title: string
  description: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  current_amount: number
  target_amount: number
  beneficiaries: number
  status: string
  category: string
  demographics: {
    population: number
    poverty_rate: string
    food_insecurity_rate: string
  }
}

export default function MapsPage() {
  const [programs, setPrograms] = useState<ProgramLocation[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<ProgramLocation[]>([])
  const [selectedProgram, setSelectedProgram] = useState<ProgramLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState({ lat: -2.5489, lng: 118.0149 }) // Indonesia center

  useEffect(() => {
    const fetchProgramLocations = async () => {
      try {
        // Simulasi fetch data program dengan koordinat
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockPrograms: ProgramLocation[] = [
          {
            id: 1,
            title: "Bantuan Pangan Daerah Terpencil Sumatra",
            description:
              "Program bantuan pangan untuk masyarakat di daerah terpencil Sumatra yang kesulitan akses makanan bergizi.",
            location: "Medan, Sumatra Utara",
            coordinates: { lat: 3.595196, lng: 98.672226 },
            current_amount: 32500000,
            target_amount: 50000000,
            beneficiaries: 1500,
            status: "active",
            category: "Bantuan Pangan Darurat",
            demographics: {
              population: 2435252,
              poverty_rate: "8.9%",
              food_insecurity_rate: "18.4%",
            },
          },
          {
            id: 2,
            title: "Gizi Anak Sekolah Papua",
            description:
              "Program pemberian makanan bergizi untuk anak-anak sekolah di Papua guna mendukung tumbuh kembang optimal.",
            location: "Jayapura, Papua",
            coordinates: { lat: -2.533333, lng: 140.716667 },
            current_amount: 45000000,
            target_amount: 75000000,
            beneficiaries: 2300,
            status: "active",
            category: "Program Gizi Anak",
            demographics: {
              population: 398478,
              poverty_rate: "27.8%",
              food_insecurity_rate: "35.2%",
            },
          },
          {
            id: 3,
            title: "Pemberdayaan Petani Lokal Jawa Tengah",
            description:
              "Program pemberdayaan petani lokal dengan teknologi pertanian modern untuk meningkatkan hasil panen.",
            location: "Semarang, Jawa Tengah",
            coordinates: { lat: -6.966667, lng: 110.416667 },
            current_amount: 100000000,
            target_amount: 100000000,
            beneficiaries: 800,
            status: "completed",
            category: "Pemberdayaan Petani",
            demographics: {
              population: 1653524,
              poverty_rate: "11.2%",
              food_insecurity_rate: "19.8%",
            },
          },
          {
            id: 4,
            title: "Program Ketahanan Pangan Sulawesi",
            description:
              "Meningkatkan ketahanan pangan melalui diversifikasi tanaman pangan lokal di Sulawesi Selatan.",
            location: "Makassar, Sulawesi Selatan",
            coordinates: { lat: -5.147665, lng: 119.432732 },
            current_amount: 25000000,
            target_amount: 60000000,
            beneficiaries: 1200,
            status: "active",
            category: "Ketahanan Pangan",
            demographics: {
              population: 1423877,
              poverty_rate: "9.1%",
              food_insecurity_rate: "16.7%",
            },
          },
          {
            id: 5,
            title: "Bantuan Gizi Balita Kalimantan",
            description: "Program khusus untuk mengatasi stunting dan malnutrisi pada balita di Kalimantan Timur.",
            location: "Samarinda, Kalimantan Timur",
            coordinates: { lat: -0.502106, lng: 117.153709 },
            current_amount: 18000000,
            target_amount: 40000000,
            beneficiaries: 950,
            status: "active",
            category: "Program Gizi Anak",
            demographics: {
              population: 827994,
              poverty_rate: "6.8%",
              food_insecurity_rate: "14.2%",
            },
          },
        ]

        setPrograms(mockPrograms)
        setFilteredPrograms(mockPrograms)
      } catch (error) {
        console.error("Error fetching program locations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgramLocations()
  }, [])

  useEffect(() => {
    let filtered = programs

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (program) =>
          program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((program) => program.category === filterCategory)
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((program) => program.status === filterStatus)
    }

    setFilteredPrograms(filtered)
  }, [programs, searchQuery, filterCategory, filterStatus])

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

  const handleProgramSelect = (program: ProgramLocation) => {
    setSelectedProgram(program)
    setMapCenter(program.coordinates)
  }

  const categories = ["Bantuan Pangan Darurat", "Program Gizi Anak", "Pemberdayaan Petani", "Ketahanan Pangan"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p>Memuat peta program donasi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-green-800">Peta Program Donasi</h1>
                <p className="text-sm text-gray-600">Lokasi program SDGs 2: Zero Hunger di seluruh Indonesia</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredPrograms.length} Program Aktif
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cari Program</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama atau lokasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="paused">Dijeda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Aksi</label>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterCategory("all")
                    setFilterStatus("all")
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Layers className="h-5 w-5 mr-2" />
                    Peta Interaktif
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{filteredPrograms.length} lokasi ditampilkan</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <InteractiveMap
                  programs={filteredPrograms}
                  center={mapCenter}
                  selectedProgram={selectedProgram}
                  onProgramSelect={handleProgramSelect}
                />
              </CardContent>
            </Card>
          </div>

          {/* Program List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daftar Program</CardTitle>
                <CardDescription>Klik program untuk melihat lokasi di peta</CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredPrograms.map((program) => (
                <Card
                  key={program.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProgram?.id === program.id ? "ring-2 ring-green-500 bg-green-50" : ""
                  }`}
                  onClick={() => handleProgramSelect(program)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant={
                            program.status === "active"
                              ? "default"
                              : program.status === "completed"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {program.status === "active"
                            ? "Aktif"
                            : program.status === "completed"
                              ? "Selesai"
                              : "Dijeda"}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {program.location}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm mb-1">{program.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2">{program.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>
                            {getProgressPercentage(program.current_amount, program.target_amount).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${getProgressPercentage(program.current_amount, program.target_amount)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{formatCurrency(program.current_amount)}</span>
                          <span className="text-gray-500">dari {formatCurrency(program.target_amount)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center text-xs text-gray-600">
                          <Users className="h-3 w-3 mr-1" />
                          {program.beneficiaries.toLocaleString()} penerima
                        </div>
                        <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Program Details */}
        {selectedProgram && (
          <div className="mt-6">
            <MapsIntegration location={selectedProgram.location} />
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{programs.length}</div>
              <p className="text-sm text-gray-600">Total Lokasi</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {programs.reduce((sum, p) => sum + p.beneficiaries, 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total Penerima</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {formatCurrency(programs.reduce((sum, p) => sum + p.current_amount, 0))}
              </div>
              <p className="text-sm text-gray-600">Total Donasi</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {new Set(programs.map((p) => p.location.split(",")[1]?.trim())).size}
              </div>
              <p className="text-sm text-gray-600">Provinsi Terjangkau</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
