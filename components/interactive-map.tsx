"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation, ZoomIn, ZoomOut, Layers } from "lucide-react"

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
}

interface InteractiveMapProps {
  programs: ProgramLocation[]
  center: { lat: number; lng: number }
  selectedProgram: ProgramLocation | null
  onProgramSelect: (program: ProgramLocation) => void
}

export default function InteractiveMap({ programs, center, selectedProgram, onProgramSelect }: InteractiveMapProps) {
  const [mapView, setMapView] = useState<"satellite" | "terrain" | "roadmap">("roadmap")
  const [zoomLevel, setZoomLevel] = useState(5)
  const mapRef = useRef<HTMLDivElement>(null)

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

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "active":
        return "#22c55e" // green
      case "completed":
        return "#3b82f6" // blue
      case "paused":
        return "#f59e0b" // amber
      default:
        return "#6b7280" // gray
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 1))
  }

  // Simulasi peta interaktif dengan SVG
  return (
    <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <div className="bg-white rounded-lg shadow-lg p-2 space-y-1">
          <Button size="sm" variant="outline" onClick={handleZoomIn} className="w-8 h-8 p-0 bg-transparent">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleZoomOut} className="w-8 h-8 p-0 bg-transparent">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-2">
          <select
            value={mapView}
            onChange={(e) => setMapView(e.target.value as any)}
            className="text-xs border-none bg-transparent focus:outline-none"
          >
            <option value="roadmap">Peta</option>
            <option value="satellite">Satelit</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-3">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              Legenda
            </h4>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                Program Aktif
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                Program Selesai
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                Program Dijeda
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Simulated Map with SVG */}
      <div className="w-full h-full relative" ref={mapRef}>
        {/* Background Map Pattern */}
        <svg className="w-full h-full" viewBox="0 0 800 500">
          {/* Indonesia outline (simplified) */}
          <defs>
            <pattern id="mapPattern" patternUnits="userSpaceOnUse" width="50" height="50">
              <rect width="50" height="50" fill={mapView === "satellite" ? "#1a365d" : "#f7fafc"} />
              <path
                d="M0,0 L50,50 M50,0 L0,50"
                stroke={mapView === "satellite" ? "#2d3748" : "#e2e8f0"}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#mapPattern)" />

          {/* Simplified Indonesia islands */}
          <g fill={mapView === "satellite" ? "#2d5016" : "#68d391"} stroke="#2d5016" strokeWidth="1">
            {/* Sumatra */}
            <ellipse cx="150" cy="180" rx="40" ry="80" transform="rotate(-20 150 180)" />
            {/* Java */}
            <ellipse cx="350" cy="320" rx="80" ry="20" />
            {/* Kalimantan */}
            <ellipse cx="400" cy="200" rx="60" ry="70" />
            {/* Sulawesi */}
            <path d="M500,180 Q520,160 540,180 Q560,200 540,220 Q520,240 500,220 Q480,200 500,180" />
            {/* Papua */}
            <ellipse cx="650" cy="250" rx="70" ry="50" />
          </g>

          {/* Program Markers */}
          {programs.map((program) => {
            // Convert lat/lng to SVG coordinates (simplified)
            const x = ((program.coordinates.lng + 95) / 50) * 800
            const y = ((program.coordinates.lat + 11) / -22) * 500
            const isSelected = selectedProgram?.id === program.id

            return (
              <g key={program.id}>
                {/* Marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 12 : 8}
                  fill={getMarkerColor(program.status)}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-10 transition-all"
                  onClick={() => onProgramSelect(program)}
                />

                {/* Marker Icon */}
                <text x={x} y={y + 1} textAnchor="middle" fontSize="8" fill="white" className="pointer-events-none">
                  ♥
                </text>

                {/* Program Info Popup */}
                {isSelected && (
                  <g>
                    <rect
                      x={x + 15}
                      y={y - 40}
                      width="200"
                      height="80"
                      fill="white"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      rx="4"
                      className="drop-shadow-lg"
                    />
                    <text x={x + 20} y={y - 25} fontSize="10" fontWeight="bold" fill="#1a202c">
                      {program.title.substring(0, 25)}...
                    </text>
                    <text x={x + 20} y={y - 15} fontSize="8" fill="#4a5568">
                      📍 {program.location}
                    </text>
                    <text x={x + 20} y={y - 5} fontSize="8" fill="#4a5568">
                      👥 {program.beneficiaries.toLocaleString()} penerima
                    </text>
                    <text x={x + 20} y={y + 5} fontSize="8" fill="#4a5568">
                      💰 {formatCurrency(program.current_amount)}
                    </text>
                    <rect x={x + 20} y={y + 10} width="170" height="4" fill="#e2e8f0" rx="2" />
                    <rect
                      x={x + 20}
                      y={y + 10}
                      width={170 * (getProgressPercentage(program.current_amount, program.target_amount) / 100)}
                      height="4"
                      fill="#22c55e"
                      rx="2"
                    />
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Compass */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="p-2">
          <div className="flex items-center justify-center w-8 h-8">
            <Navigation className="h-4 w-4 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Scale */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white px-2 py-1 rounded text-xs">Zoom: {zoomLevel}</div>
      </div>
    </div>
  )
}
