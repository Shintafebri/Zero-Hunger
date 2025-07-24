import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, Target, Heart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">Donasi Pangan SDGs</h1>
          </div>
          <nav className="flex space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Donasi Pangan SDGs 2: Zero Hunger</h2>
            <p className="text-xl text-gray-600 mb-8">
              Bergabunglah dalam misi menghapus kelaparan dan mencapai ketahanan pangan untuk semua. Setiap donasi Anda
              berkontribusi langsung pada SDGs 2: Zero Hunger.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/donate">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Donasi Sekarang
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Lihat Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold">10,000+</CardTitle>
                <CardDescription>Orang Terbantu</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold">500+</CardTitle>
                <CardDescription>Program Donasi</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold">50+</CardTitle>
                <CardDescription>Kota Terjangkau</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* SDGs Info Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Tentang SDGs 2: Zero Hunger</h3>
            <p className="text-lg text-gray-600 mb-8">
              Sustainable Development Goal 2 bertujuan untuk mengakhiri kelaparan, mencapai ketahanan pangan dan nutrisi
              yang lebih baik, serta mempromosikan pertanian berkelanjutan pada tahun 2030.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Target Utama</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-left space-y-2">
                    <li>• Mengakhiri kelaparan dan malnutrisi</li>
                    <li>• Meningkatkan produktivitas pertanian</li>
                    <li>• Memastikan sistem pangan berkelanjutan</li>
                    <li>• Menjaga keragaman genetik benih</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Dampak Donasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-left space-y-2">
                    <li>• Bantuan pangan langsung</li>
                    <li>• Program edukasi gizi</li>
                    <li>• Pemberdayaan petani lokal</li>
                    <li>• Pengembangan teknologi pertanian</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Donasi Pangan SDGs</h4>
              <p className="text-gray-400">
                Platform donasi untuk mendukung SDGs 2: Zero Hunger dan menciptakan dunia tanpa kelaparan.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <p className="text-gray-400">Email: info@donasipangan.org</p>
              <p className="text-gray-400">Phone: +62 21 1234 5678</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Referensi</h4>
              <Link href="https://sdgs.itpln.ac.id" className="text-green-400 hover:underline block">
                SDGs ITB PLN
              </Link>
              <Link href="https://sdgs.un.org/goals/goal2" className="text-green-400 hover:underline block">
                UN SDGs Goal 2
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Donasi Pangan SDGs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
