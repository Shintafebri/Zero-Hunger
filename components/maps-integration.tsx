"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, TrendingDown, Navigation, Share2, Heart } from "lucide-react"

interface LocationData {
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  programs_nearby: Array<{
    id: number
    title: string
    distance: string
    beneficiaries: number
  }>
  demographics: {
    population: number
    poverty_rate: string
    food_insecurity_rate: string
  }
  weather?: {
    temperature: string
    condition: string
    humidity: string
  }
  infrastructure: {
    hospitals: number
    schools: number
    markets: number
    roads_quality: string
  }
}

interface MapsIntegrationProps {
  location: string
}

export default function MapsIntegration({ location }: MapsIntegrationProps) {
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch(`/api/maps?location=${encodeURIComponent(location)}`)
        const result = await response.json()

        if (result.success && result.data.results.length > 0) {
          // Enhanced location data with additional information
          const enhancedData = {
            ...result.data.results[0],
            weather: {
              temperature: "28°C",
              condition: "Cerah berawan",
              humidity: "75%",
            },
            infrastructure: {
              hospitals: Math.floor(Math.random() * 10) + 1,
              schools: Math.floor(Math.random() * 50) + 10,
              markets: Math.floor(Math.random() * 20) + 5,
              roads_quality: ["Baik", "Sedang", "Perlu Perbaikan"][Math.floor(Math.random() * 3)],
            },
          }
          setLocationData(enhancedData)
        }
      } catch (error) {
        console.error("Error fetching location data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (location) {
      fetchLocationData()
    }
  }, [location])

  const handleGetDirections = () => {
    if (locationData) {
      const { lat, lng } = locationData.geometry.location
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      window.open(url, "_blank")
    }
  }

  const handleShareLocation = async () => {
    if (locationData && navigator.share) {
      try {
        await navigator.share({
          title: `Program Donasi di ${locationData.name}`,
          text: `Lihat program donasi SDGs 2: Zero Hunger di ${locationData.formatted_address}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!locationData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">Data lokasi tidak tersedia</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Detail Lokasi Program
            </CardTitle>
            <CardDescription>{locationData.formatted_address}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleGetDirections}>
              <Navigation className="h-4 w-4 mr-1" />
              Rute
            </Button>
            <Button size="sm" variant="outline" onClick={handleShareLocation}>
              <Share2 className="h-4 w-4 mr-1" />
              Bagikan
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demografis</TabsTrigger>
            <TabsTrigger value="programs">Program</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastruktur</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Enhanced Map Placeholder */}
            <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="text-center z-10">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium">Peta Interaktif</p>
                <p className="text-sm text-gray-500">
                  Lat: {locationData.geometry.location.lat.toFixed(6)}, Lng:{" "}
                  {locationData.geometry.location.lng.toFixed(6)}
                </p>
                {locationData.weather && (
                  <div className="mt-2 text-sm text-gray-600">
                    🌤️ {locationData.weather.temperature} • {locationData.weather.condition}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Populasi</p>
                <p className="font-semibold">{locationData.demographics.population.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Kemiskinan</p>
                <p className="font-semibold">{locationData.demographics.poverty_rate}</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Heart className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Rawan Pangan</p>
                <p className="font-semibold">{locationData.demographics.food_insecurity_rate}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Data Kependudukan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Populasi</span>
                    <span className="font-semibold">{locationData.demographics.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tingkat Kemiskinan</span>
                    <Badge variant="destructive">{locationData.demographics.poverty_rate}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rawan Pangan</span>
                    <Badge variant="secondary">{locationData.demographics.food_insecurity_rate}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Kondisi Cuaca</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {locationData.weather && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Suhu</span>
                        <span className="font-semibold">{locationData.weather.temperature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kondisi</span>
                        <span className="font-semibold">{locationData.weather.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kelembaban</span>
                        <span className="font-semibold">{locationData.weather.humidity}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="programs" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Program Terdekat</h4>
              <div className="space-y-3">
                {locationData.programs_nearby.map((program) => (
                  <div key={program.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{program.title}</p>
                      <p className="text-xs text-gray-600">{program.distance} dari lokasi</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{program.beneficiaries} penerima</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Fasilitas Kesehatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rumah Sakit</span>
                    <Badge variant="outline">{locationData.infrastructure.hospitals} unit</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Fasilitas Pendidikan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sekolah</span>
                    <Badge variant="outline">{locationData.infrastructure.schools} unit</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Fasilitas Ekonomi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pasar</span>
                    <Badge variant="outline">{locationData.infrastructure.markets} unit</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Infrastruktur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Kualitas Jalan</span>
                    <Badge
                      variant={
                        locationData.infrastructure.roads_quality === "Baik"
                          ? "default"
                          : locationData.infrastructure.roads_quality === "Sedang"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {locationData.infrastructure.roads_quality}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
