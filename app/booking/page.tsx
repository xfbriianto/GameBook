"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Gamepad2, Monitor, Headphones, ArrowLeft } from "lucide-react"

const gameStations = [
  {
    id: 1,
    name: "PlayStation 5 - TV 1",
    type: "PS5",
    price: 50000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: 2,
    name: "PlayStation 5 - TV 2",
    type: "PS5",
    price: 50000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: 3,
    name: "PlayStation 4 - TV 3",
    type: "PS4",
    price: 35000,
    image: "/placeholder.svg?height=200&width=300",
    available: false,
  },
  {
    id: 4,
    name: "PC Gaming - 01",
    type: "PC Gaming",
    price: 60000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: 5,
    name: "PC Gaming - 02",
    type: "PC Gaming",
    price: 60000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: 6,
    name: "VR Station - 01",
    type: "VR",
    price: 80000,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
]

export default function BookingListPage() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PS5":
      case "PS4":
        return <Gamepad2 className="w-4 h-4" />
      case "PC Gaming":
        return <Monitor className="w-4 h-4" />
      case "VR":
        return <Headphones className="w-4 h-4" />
      default:
        return <Gamepad2 className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PS5":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "PS4":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
      case "PC Gaming":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "VR":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GameBook
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Select a Game Station to Book</h2>
          <p className="text-lg text-gray-600">Choose your preferred gaming station and proceed with booking</p>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameStations.map((station) => (
            <Card
              key={station.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border border-gray-200"
            >
              <CardHeader className="p-0">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={station.image || "/placeholder.svg"}
                    alt={station.name}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">{station.name}</CardTitle>
                  <Badge className={`${getTypeColor(station.type)} flex items-center gap-1`}>
                    {getTypeIcon(station.type)}
                    {station.type}
                  </Badge>
                </div>

                <p className="text-2xl font-bold text-gray-900 mb-4">
                  Rp {station.price.toLocaleString("id-ID")} / jam
                </p>

                <div className="mb-4">
                  <Badge className={station.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {station.available ? "Available" : "Not Available"}
                  </Badge>
                </div>

                <Link href={`/booking/${station.id}`}>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={!station.available}
                  >
                    {station.available ? "Book This Station" : "Not Available"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
