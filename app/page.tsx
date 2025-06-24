"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Gamepad2, Monitor, Headphones } from "lucide-react"

interface Station {
  id: number;
  name: string;
  type: string;
  price: number;
  status: string;
  image?: string;
  available?: boolean;
  // tambahkan field lain jika ada
}

interface User {
  id: number;
  username: string;
  role: string;
}

export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([])
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchStations()

    // Check for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [])

  const fetchStations = async () => {
    const res = await fetch("/api/stations")
    const result = await res.json()
    setStations(result.data)
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.refresh(); // Refresh the page to reflect login state
  };

  const filteredStations =
    selectedFilter === "All" ? stations : stations.filter((station) => station.type === selectedFilter)

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
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GameBook
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/admin">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Admin
                </Button>
              </Link>
              {user ? (
                <>
                  <span className="font-medium text-gray-700">Hi, {user.username}</span>
                  <Button onClick={handleLogout} variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Game Station</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our premium gaming setups and book your perfect gaming session
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex justify-center mb-8">
          <ToggleGroup
            type="single"
            value={selectedFilter}
            onValueChange={(value) => value && setSelectedFilter(value)}
            className="bg-white rounded-lg p-1 shadow-sm border border-gray-200"
          >
            <ToggleGroupItem value="All" className="data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="PS5" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800">
              PS5
            </ToggleGroupItem>
            <ToggleGroupItem value="PS4" className="data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-800">
              PS4
            </ToggleGroupItem>
            <ToggleGroupItem value="PC Gaming" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800">
              PC Gaming
            </ToggleGroupItem>
            <ToggleGroupItem value="VR" className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800">
              VR
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
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

                <Link href={`/booking/${station.id}`}>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={station.status !== "Available"}
                  >
                    {station.status === "Available" ? "Book Now" : "Not Available"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No stations found for the selected filter.</p>
          </div>
        )}
      </main>
    </div>
  )
}
