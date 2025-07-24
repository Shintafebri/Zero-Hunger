"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Heart, Download, Share2, MapPin, CreditCard, Users, Target, ArrowRight } from "lucide-react"

interface PaymentDetails {
  transaction_id: string
  donation_id: number
  amount: number
  payment_method: string
  donor_name: string
  donor_email: string
  program: {
    id: number
    title: string
    location: string
    current_amount: number
    target_amount: number
  }
  status: string
  created_at: string
  va_number?: string
  payment_url?: string
}

export default function PaymentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const transactionId = params.transactionId as string

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Simulasi fetch payment details - dalam XAMPP akan fetch dari PHP API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockPaymentDetails: PaymentDetails = {
          transaction_id: transactionId,
          donation_id: 1001,
          amount: 500000,
          payment_method: "BCA Virtual Account",
          donor_name: "Ahmad Wijaya",
          donor_email: "ahmad@example.com",
          program: {
            id: 1,
            title: "Bantuan Pangan Daerah Terpencil Sumatra",
            location: "Sumatra Utara",
            current_amount: 33000000,
            target_amount: 50000000,
          },
          status: "success",
          created_at: new Date().toISOString(),
          va_number: "8808123456789012",
        }

        setPaymentDetails(mockPaymentDetails)
      } catch (error) {
        console.error("Error fetching payment details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (transactionId) {
      fetchPaymentDetails()
    }
  }, [transactionId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const handleShare = async () => {
    setSharing(true)

    const shareData = {
      title: "Saya telah berdonasi untuk Zero Hunger!",
      text: `Saya baru saja berdonasi ${formatCurrency(paymentDetails?.amount || 0)} untuk program "${paymentDetails?.program.title}". Mari bersama-sama dukung SDGs 2: Zero Hunger!`,
      url: window.location.origin,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback untuk browser yang tidak support Web Share API
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        alert("Link berhasil disalin ke clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setSharing(false)
    }
  }

  const downloadReceipt = () => {
    // Simulasi download receipt - dalam implementasi nyata akan generate PDF
    const receiptData = {
      transaction_id: paymentDetails?.transaction_id,
      amount: paymentDetails?.amount,
      date: paymentDetails?.created_at,
      program: paymentDetails?.program.title,
    }

    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${paymentDetails?.transaction_id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p>Memuat detail pembayaran...</p>
        </div>
      </div>
    )
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <CheckCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Transaksi Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">Maaf, kami tidak dapat menemukan detail transaksi ini.</p>
            <Link href="/dashboard">
              <Button>Kembali ke Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Heart className="h-8 w-8 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-green-800">Donasi Berhasil</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Donasi Berhasil!</h2>
            <p className="text-lg text-gray-600">Terima kasih atas kontribusi Anda untuk SDGs 2: Zero Hunger</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Detail Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID</span>
                  <Badge variant="secondary" className="font-mono">
                    {paymentDetails.transaction_id}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jumlah Donasi</span>
                  <span className="font-semibold text-lg text-green-600">{formatCurrency(paymentDetails.amount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Metode Pembayaran</span>
                  <span className="font-medium">{paymentDetails.payment_method}</span>
                </div>

                {paymentDetails.va_number && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Virtual Account</span>
                    <span className="font-mono text-sm">{paymentDetails.va_number}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">Berhasil</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Waktu Transaksi</span>
                  <span className="text-sm">{formatDate(paymentDetails.created_at)}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Data Donatur</h4>
                  <p className="text-sm text-gray-600">Nama: {paymentDetails.donor_name}</p>
                  <p className="text-sm text-gray-600">Email: {paymentDetails.donor_email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Program Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Program yang Didukung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{paymentDetails.program.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {paymentDetails.program.location}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress Setelah Donasi Anda</span>
                    <span>
                      {getProgressPercentage(
                        paymentDetails.program.current_amount,
                        paymentDetails.program.target_amount,
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${getProgressPercentage(paymentDetails.program.current_amount, paymentDetails.program.target_amount)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{formatCurrency(paymentDetails.program.current_amount)}</span>
                    <span className="text-gray-600">dari {formatCurrency(paymentDetails.program.target_amount)}</span>
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Heart className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    Donasi Anda telah meningkatkan progress program sebesar{" "}
                    {((paymentDetails.amount / paymentDetails.program.target_amount) * 100).toFixed(2)}%!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Impact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Dampak Donasi Anda
              </CardTitle>
              <CardDescription>
                Berikut adalah estimasi dampak dari donasi Anda terhadap pencapaian SDGs 2: Zero Hunger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {Math.floor(paymentDetails.amount / 25000)}
                  </div>
                  <p className="text-sm text-blue-800">Orang dapat makan selama 1 hari</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {Math.floor(paymentDetails.amount / 100000)}
                  </div>
                  <p className="text-sm text-green-800">Keluarga terbantu program gizi</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {Math.floor(paymentDetails.amount / 50000)}
                  </div>
                  <p className="text-sm text-orange-800">Anak mendapat makanan bergizi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={downloadReceipt} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Kwitansi
              </Button>

              <Button onClick={handleShare} disabled={sharing}>
                <Share2 className="h-4 w-4 mr-2" />
                {sharing ? "Membagikan..." : "Bagikan Donasi"}
              </Button>

              <Link href={`/programs/${paymentDetails.program.id}`}>
                <Button variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Lihat Program
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/donate">
                <Button>
                  <Heart className="h-4 w-4 mr-2" />
                  Donasi Lagi
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRight className="h-5 w-5 mr-2" />
                Langkah Selanjutnya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Konfirmasi Email</h4>
                    <p className="text-sm text-gray-600">
                      Kami akan mengirim konfirmasi donasi dan kwitansi digital ke email Anda dalam 5-10 menit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Update Progress</h4>
                    <p className="text-sm text-gray-600">
                      Pantau perkembangan program melalui dashboard dan dapatkan update berkala via email.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Laporan Dampak</h4>
                    <p className="text-sm text-gray-600">
                      Terima laporan dampak program setiap bulan untuk melihat hasil nyata dari donasi Anda.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <div className="mt-8 text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
            <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Donasi Anda adalah langkah nyata menuju pencapaian SDGs 2: Zero Hunger. Bersama-sama, kita dapat
              menciptakan dunia tanpa kelaparan dan memastikan setiap orang memiliki akses terhadap makanan bergizi yang
              cukup.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
