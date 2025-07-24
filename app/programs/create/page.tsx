"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, MapPin } from "lucide-react"

export default function CreateProgramPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_amount: "",
    location: "",
    category: "",
    start_date: "",
    end_date: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const provinces = [
    "Aceh",
    "Sumatra Utara",
    "Sumatra Barat",
    "Riau",
    "Jambi",
    "Sumatra Selatan",
    "Bengkulu",
    "Lampung",
    "Kepulauan Bangka Belitung",
    "Kepulauan Riau",
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "DI Yogyakarta",
    "Jawa Timur",
    "Banten",
    "Bali",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Selatan",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Sulawesi Utara",
    "Sulawesi Tengah",
    "Sulawesi Selatan",
    "Sulawesi Tenggara",
    "Gorontalo",
    "Sulawesi Barat",
    "Maluku",
    "Maluku Utara",
    "Papua",
    "Papua Barat",
    "Papua Selatan",
    "Papua Tengah",
    "Papua Pegunungan",
    "Papua Barat Daya",
  ]

  const categories = [
    "Bantuan Pangan Darurat",
    "Program Gizi Anak",
    "Pemberdayaan Petani",
    "Teknologi Pertanian",
    "Edukasi Gizi",
    "Ketahanan Pangan Desa",
  ]

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validasi
    if (!formData.title || !formData.description || !formData.target_amount || !formData.location) {
      setError("Semua field wajib diisi")
      setLoading(false)
      return
    }

    if (Number.parseInt(formData.target_amount) < 1000000) {
      setError("Target donasi minimal Rp 1.000.000")
      setLoading(false)
      return
    }

    try {
      // Simulasi API call - dalam XAMPP akan mengirim ke PHP backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const programData = {
        id: Date.now(),
        ...formData,
        target_amount: Number.parseInt(formData.target_amount),
        current_amount: 0,
        status: "active",
        created_at: new Date().toISOString(),
      }

      // Simulasi penyimpanan ke database
      console.log("Program created:", programData)

      setSuccess("Program donasi berhasil dibuat!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("Terjadi kesalahan saat membuat program")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: string) => {
    if (!amount) return ""
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number.parseInt(amount))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Heart className="h-8 w-8 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-green-800">Buat Program Donasi</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Program Donasi Baru</CardTitle>
              <CardDescription>Buat program donasi untuk mendukung SDGs 2: Zero Hunger</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                {/* Judul Program */}
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Program *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Contoh: Bantuan Pangan Daerah Terpencil Sumatra"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Program *</Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan tujuan, target penerima, dan dampak yang diharapkan dari program ini..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Target Donasi */}
                <div className="space-y-2">
                  <Label htmlFor="target_amount">Target Donasi (Rp) *</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    placeholder="Minimal Rp 1.000.000"
                    value={formData.target_amount}
                    onChange={(e) => handleChange("target_amount", e.target.value)}
                    min="1000000"
                    required
                  />
                  {formData.target_amount && (
                    <p className="text-sm text-gray-600">Target: {formatCurrency(formData.target_amount)}</p>
                  )}
                </div>

                {/* Lokasi */}
                <div className="space-y-2">
                  <Label>Lokasi Program *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {province}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Kategori */}
                <div className="space-y-2">
                  <Label>Kategori Program</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tanggal */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Tanggal Mulai</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange("start_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Tanggal Berakhir</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                    />
                  </div>
                </div>

                {/* Info SDGs */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Kontribusi pada SDGs 2: Zero Hunger</h4>
                  <p className="text-sm text-green-700">
                    Program ini akan berkontribusi pada pencapaian target SDGs 2 dengan fokus pada:
                  </p>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Mengurangi kelaparan dan malnutrisi</li>
                    <li>• Meningkatkan akses terhadap pangan bergizi</li>
                    <li>• Mendukung sistem pangan berkelanjutan</li>
                    <li>• Memberdayakan masyarakat lokal</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Membuat..." : "Buat Program"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
