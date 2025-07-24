"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Heart, CreditCard, Building, MapPin } from "lucide-react"

interface DonationProgram {
  id: number
  title: string
  description: string
  target_amount: number
  current_amount: number
  location: string
}

export default function DonatePage() {
  const [selectedProgram, setSelectedProgram] = useState<DonationProgram | null>(null)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [donorPhone, setDonorPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const programId = searchParams.get("program")

  const programs: DonationProgram[] = [
    {
      id: 1,
      title: "Bantuan Pangan Daerah Terpencil Sumatra",
      description:
        "Program bantuan pangan untuk masyarakat di daerah terpencil Sumatra yang kesulitan akses makanan bergizi.",
      target_amount: 50000000,
      current_amount: 32500000,
      location: "Sumatra Utara",
    },
    {
      id: 2,
      title: "Gizi Anak Sekolah Papua",
      description:
        "Program pemberian makanan bergizi untuk anak-anak sekolah di Papua guna mendukung tumbuh kembang optimal.",
      target_amount: 75000000,
      current_amount: 45000000,
      location: "Papua",
    },
  ]

  const paymentMethods = [
    { id: "bca", name: "BCA Virtual Account", icon: "🏦" },
    { id: "mandiri", name: "Mandiri Virtual Account", icon: "🏦" },
    { id: "bni", name: "BNI Virtual Account", icon: "🏦" },
    { id: "bri", name: "BRI Virtual Account", icon: "🏦" },
    { id: "gopay", name: "GoPay", icon: "📱" },
    { id: "ovo", name: "OVO", icon: "📱" },
    { id: "dana", name: "DANA", icon: "📱" },
    { id: "shopeepay", name: "ShopeePay", icon: "📱" },
  ]

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000]

  useEffect(() => {
    if (programId) {
      const program = programs.find((p) => p.id === Number.parseInt(programId))
      if (program) {
        setSelectedProgram(program)
      }
    }
  }, [programId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
  }

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validasi
    if (!selectedProgram) {
      setError("Pilih program donasi terlebih dahulu")
      setLoading(false)
      return
    }

    if (!amount || Number.parseInt(amount) < 10000) {
      setError("Minimal donasi Rp 10.000")
      setLoading(false)
      return
    }

    if (!paymentMethod) {
      setError("Pilih metode pembayaran")
      setLoading(false)
      return
    }

    try {
      // Simulasi integrasi dengan Midtrans/Xendit
      const donationData = {
        program_id: selectedProgram.id,
        amount: Number.parseInt(amount),
        payment_method: paymentMethod,
        donor_name: donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone,
        message: message,
        created_at: new Date().toISOString(),
      }

      // Simulasi API call ke payment gateway
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulasi response dari payment gateway
      const paymentResponse = {
        transaction_id: `TXN${Date.now()}`,
        payment_url: `https://app.midtrans.com/snap/v1/transactions/${Date.now()}`,
        va_number: `8808${Math.random().toString().substr(2, 10)}`,
        status: "success",
      }

      // Redirect langsung ke halaman sukses
      router.push(`/payment/${paymentResponse.transaction_id}`)
    } catch (err) {
      setError("Terjadi kesalahan saat memproses donasi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Heart className="h-8 w-8 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-green-800">Donasi Pangan SDGs</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Berdonasi untuk Zero Hunger</h2>
            <p className="text-lg text-gray-600">Setiap donasi Anda berkontribusi langsung pada SDGs 2: Zero Hunger</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Donasi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Form Donasi
                </CardTitle>
                <CardDescription>Isi form di bawah untuk melakukan donasi</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDonate} className="space-y-6">
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

                  {/* Pilih Program */}
                  <div className="space-y-2">
                    <Label>Pilih Program Donasi</Label>
                    <Select
                      value={selectedProgram?.id.toString() || ""}
                      onValueChange={(value) => {
                        const program = programs.find((p) => p.id === Number.parseInt(value))
                        setSelectedProgram(program || null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih program donasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id.toString()}>
                            {program.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Jumlah Donasi */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Jumlah Donasi (Rp)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Minimal Rp 10.000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="10000"
                      required
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {quickAmounts.map((quickAmount) => (
                        <Button
                          key={quickAmount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAmount(quickAmount)}
                        >
                          {formatCurrency(quickAmount)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Data Donatur */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="donorName">Nama Lengkap</Label>
                      <Input
                        id="donorName"
                        type="text"
                        placeholder="Nama lengkap"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donorEmail">Email</Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        placeholder="email@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donorPhone">Nomor Telepon</Label>
                    <Input
                      id="donorPhone"
                      type="tel"
                      placeholder="08123456789"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      required
                    />
                  </div>

                  {/* Metode Pembayaran */}
                  <div className="space-y-2">
                    <Label>Metode Pembayaran</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          type="button"
                          variant={paymentMethod === method.id ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <span className="mr-2">{method.icon}</span>
                          {method.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Pesan */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan (Opsional)</Label>
                    <Input
                      id="message"
                      type="text"
                      placeholder="Pesan untuk penerima donasi"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Memproses..." : `Donasi ${amount ? formatCurrency(Number.parseInt(amount)) : ""}`}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Program */}
            <div className="space-y-6">
              {selectedProgram && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Detail Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedProgram.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{selectedProgram.description}</p>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedProgram.location}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {((selectedProgram.current_amount / selectedProgram.target_amount) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${(selectedProgram.current_amount / selectedProgram.target_amount) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{formatCurrency(selectedProgram.current_amount)}</span>
                          <span className="text-gray-600">dari {formatCurrency(selectedProgram.target_amount)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Info SDGs */}
              <Card>
                <CardHeader>
                  <CardTitle>Tentang SDGs 2: Zero Hunger</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Donasi Anda berkontribusi langsung pada pencapaian Sustainable Development Goal 2: Zero Hunger.
                    </p>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="mr-2">
                        Target 2.1
                      </Badge>
                      <span className="text-sm">Mengakhiri kelaparan dan malnutrisi</span>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="mr-2">
                        Target 2.2
                      </Badge>
                      <span className="text-sm">Meningkatkan akses pangan bergizi</span>
                    </div>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="mr-2">
                        Target 2.3
                      </Badge>
                      <span className="text-sm">Meningkatkan produktivitas pertanian</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
