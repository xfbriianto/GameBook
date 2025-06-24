"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LayoutDashboard, Calendar, Gamepad2, Users, LogOut, DollarSign, CalendarCheck, Wrench } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface Station {
  id: number
  name: string
  type: string
  status: string
  price: number
}

interface Booking {
  id: string
  stationId: number
  date: string
  time: string
  duration: number
  totalPrice: number
  status: string
  createdAt: string
  station: {
    id: number
    name: string
    type: string
  }
  user: {
    id: number
    username: string
  }
}

const gameStations = [
  { id: 1, name: "PlayStation 5 - TV 1", type: "PS5", status: "Available" },
  { id: 2, name: "PlayStation 5 - TV 2", type: "PS5", status: "In Use" },
  { id: 3, name: "PlayStation 4 - TV 3", type: "PS4", status: "Available" },
  { id: 4, name: "PC Gaming - 01", type: "PC Gaming", status: "In Use" },
  { id: 5, name: "PC Gaming - 02", type: "PC Gaming", status: "Maintenance" },
  { id: 6, name: "VR Station - 01", type: "VR", status: "Available" },
]

const todaySchedule = [
  { time: "09:00", station: "PS5 - TV 1", user: "John Doe", status: "Confirmed" },
  { time: "10:00", station: "PC Gaming - 01", user: "Jane Smith", status: "In Progress" },
  { time: "11:00", station: "VR Station - 01", user: "Mike Johnson", status: "Confirmed" },
  { time: "14:00", station: "PS5 - TV 2", user: "Sarah Wilson", status: "In Progress" },
  { time: "16:00", station: "PC Gaming - 02", user: "David Brown", status: "Confirmed" },
]

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stations, setStations] = useState<Station[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    // Fetch bookings
    const bookingsRes = await fetch("/api/bookings")
    const bookingsData = await bookingsRes.json()
    setBookings(bookingsData.data)

    // Fetch stations
    const stationsRes = await fetch("/api/stations")
    const stationsData = await stationsRes.json()
    setStations(stationsData.data)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">Loading...</span>
      </div>
    )
  }

  // Get today's date at midnight for comparison
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const todayBookings = bookings.filter(booking => booking.date === todayStr)

  // Calculate stats
  const todayRevenue = todayBookings.reduce((total, booking) => total + booking.totalPrice, 0)
  const stationsInUse = stations.filter(station => station.status.toLowerCase().replace(/[-_]/g, ' ').trim() === "in use").length
  const stationsNeedMaintenance = stations.filter(station => station.status.toLowerCase().replace(/[-_]/g, ' ').trim() === "maintenance").length

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800"
      case "in-use":
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "confirmed":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format status text for display
  const getStatusText = (status: string) => {
    return status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GameBook
            </h1>
          </div>

          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Calendar className="w-5 h-5" />
              <span>Bookings</span>
            </Link>
            <Link
              href="/admin/stations"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Stations</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </Link>
            <Link href="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Hello, Admin! Here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">Rp {todayRevenue.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stations In Use</p>
                    <p className="text-2xl font-bold text-gray-900">{stationsInUse}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Needs Maintenance</p>
                    <p className="text-2xl font-bold text-gray-900">{stationsNeedMaintenance}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Schedule */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Station</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                          No bookings scheduled for today
                        </TableCell>
                      </TableRow>
                    ) : (
                      todayBookings
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.time}</TableCell>
                            <TableCell>{booking.station.name}</TableCell>
                            <TableCell>{booking.user.username}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusText(booking.status)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Station Status */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Station Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                          No stations available
                        </TableCell>
                      </TableRow>
                    ) : (
                      stations.map((station) => (
                        <TableRow key={station.id}>
                          <TableCell className="font-medium">{station.name}</TableCell>
                          <TableCell>{station.type}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(station.status)}>
                              {getStatusText(station.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
