import { NextResponse } from "next/server"

// Simulasi API Maps untuk lokasi program donasi
// Dalam implementasi XAMPP, ini akan mengintegrasikan dengan Google Maps API atau Leaflet
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")

  try {
    // Simulasi data lokasi dari Google Maps API
    const locationData = {
      query: location,
      results: [
        {
          place_id: "ChIJ0YK6Ap0oQjAR0Q6bF2z1HAM",
          name: location || "Indonesia",
          formatted_address: `${location}, Indonesia`,
          geometry: {
            location: {
              lat: location === "Papua" ? -4.269928 : location === "Sumatra Utara" ? 3.595196 : -6.17511,
              lng: location === "Papua" ? 138.080353 : location === "Sumatra Utara" ? 98.672226 : 106.865036,
            },
          },
          types: ["administrative_area_level_1", "political"],
          programs_nearby: [
            {
              id: 1,
              title: "Bantuan Pangan Daerah Terpencil",
              distance: "2.5 km",
              beneficiaries: 150,
            },
            {
              id: 2,
              title: "Program Gizi Anak Sekolah",
              distance: "5.1 km",
              beneficiaries: 300,
            },
          ],
          demographics: {
            population: location === "Papua" ? 4200000 : location === "Sumatra Utara" ? 15000000 : 10000000,
            poverty_rate: location === "Papua" ? "27.8%" : location === "Sumatra Utara" ? "8.9%" : "12.5%",
            food_insecurity_rate: location === "Papua" ? "35.2%" : location === "Sumatra Utara" ? "18.4%" : "22.1%",
          },
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: locationData,
      source: "Google Maps API",
      last_updated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch location data" }, { status: 500 })
  }
}
