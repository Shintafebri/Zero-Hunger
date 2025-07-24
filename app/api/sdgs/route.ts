import { NextResponse } from "next/server"

// Simulasi API eksternal untuk data SDGs
// Dalam implementasi XAMPP, ini akan menjadi endpoint PHP yang mengambil data dari API pemerintah
export async function GET() {
  try {
    // Simulasi data SDGs dari API pemerintah
    const sdgsData = {
      goal: 2,
      title: "Zero Hunger",
      description: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture",
      targets: [
        {
          id: "2.1",
          title: "End hunger and ensure access by all people to safe, nutritious and sufficient food",
          indicators: [
            {
              id: "2.1.1",
              title: "Prevalence of undernourishment",
              value: "8.9%",
              year: 2023,
              status: "improving",
            },
            {
              id: "2.1.2",
              title: "Prevalence of moderate or severe food insecurity",
              value: "23.2%",
              year: 2023,
              status: "stable",
            },
          ],
        },
        {
          id: "2.2",
          title: "End all forms of malnutrition",
          indicators: [
            {
              id: "2.2.1",
              title: "Prevalence of stunting among children under 5",
              value: "21.6%",
              year: 2023,
              status: "improving",
            },
            {
              id: "2.2.2",
              title: "Prevalence of wasting among children under 5",
              value: "7.7%",
              year: 2023,
              status: "stable",
            },
          ],
        },
      ],
      indonesia_data: {
        hunger_index: 64,
        food_security_level: "Moderate",
        agricultural_productivity: "Increasing",
        rural_poverty_rate: "12.3%",
        programs: [
          "Program Keluarga Harapan (PKH)",
          "Bantuan Pangan Non Tunai (BPNT)",
          "Program Indonesia Pintar (PIP)",
          "Gerakan Nasional Percepatan Perbaikan Gizi",
        ],
      },
    }

    return NextResponse.json({
      success: true,
      data: sdgsData,
      source: "API Pemerintah Indonesia - Bappenas",
      last_updated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch SDGs data" }, { status: 500 })
  }
}
