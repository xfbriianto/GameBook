"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ArrowLeft, Gamepad2, Monitor, Headphones } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]

// This is now fetched from localStorage, so we can define the type here
interface User {
  id: number;
  username: string;
  role: string;
}

const bookedSlots = ["10:00", "14:00", "18:00"] // Simulated booked slots

interface Booking {
  id: string
  stationId: number
  date: string
  time: string
  duration: number
  totalPrice: number
  createdAt: string
}

interface Station {
  id: number;
  name: string;
  type: string;
  price: number;
  status: string;
  image?: string;
  description?: string;
  specs?: string[];
  // tambahkan field lain jika ada
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const stationId = Number.parseInt(params.id as string)
  const [station, setStation] = useState<Station | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [duration, setDuration] = useState<number>(1)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // If no user, redirect to login
      router.push("/login")
      return; // Stop execution of other effects
    }
    
    setMounted(true)
    const fetchStation = async () => {
      const res = await fetch(`/api/stations/${stationId}`)
      const result = await res.json()
      if (result.success) setStation(result.data)
      setLoading(false)
    }
    fetchStation()
  }, [stationId, router])

  useEffect(() => {
    const savedBookings = localStorage.getItem("gameBookings")
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }
  }, [])

  if (loading || !mounted || !user) return <div>Loading...</div>
  if (!station) return <div>Station Not Found</div>

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PS5":
      case "PS4":
        return <Gamepad2 className="w-5 h-5" />
      case "PC Gaming":
        return <Monitor className="w-5 h-5" />
      case "VR":
        return <Headphones className="w-5 h-5" />
      default:
        return <Gamepad2 className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PS5":
        return "bg-blue-100 text-blue-800"
      case "PS4":
        return "bg-indigo-100 text-indigo-800"
      case "PC Gaming":
        return "bg-green-100 text-green-800"
      case "VR":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAvailableSlots = () => {
    if (!selectedDate) return []

    const dateString = format(selectedDate, "yyyy-MM-dd")
    const bookedForDate = bookings
      .filter((booking) => booking.stationId === stationId && booking.date === dateString)
      .map((booking) => booking.time)

    return timeSlots.filter((slot) => !bookedForDate.includes(slot) && !bookedSlots.includes(slot))
  }

  const totalPrice = station?.price * duration

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time")
      return
    }

    if (!user) {
      alert("You must be logged in to book.")
      router.push('/login')
      return;
    }

    const newBooking = {
      stationId,
      userId: user.id, // Use the actual logged-in user's ID
      date: new Date(selectedDate).toISOString(), // untuk DateTime
      time: selectedTime,
      duration,
      totalPrice,
      status: "confirmed",
    }

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    });
    const result = await response.json();

    if (result.success) {
      alert("Booking confirmed successfully!");
      router.push("/admin/bookings");
    } else {
      alert("Gagal booking: " + (result.error || "Unknown error"));
    }
  }

  const availableSlots = getAvailableSlots()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Stations</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Station Details */}
          <div className="space-y-6">
            <Card className="overflow-hidden bg-white border border-gray-200">
              <AspectRatio ratio={16 / 10}>
                <img
                  src={station.image || "/placeholder.svg"}
                  alt={station.name}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{station.name}</h1>
                <Badge className={`${getTypeColor(station.type)} flex items-center gap-2`}>
                  {getTypeIcon(station.type)}
                  {station.type}
                </Badge>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">{station.description}</p>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Specifications & Features
                </h3>
                <ul className="space-y-3">
                  {station.specs?.map((spec, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Book Your Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border border-gray-200"
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Available Time Slots for {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: localeId })}
                    </h3>
                    {availableSlots.length > 0 ? (
                      <ToggleGroup
                        type="single"
                        value={selectedTime}
                        onValueChange={(value) => value && setSelectedTime(value)}
                        className="grid grid-cols-3 gap-2"
                      >
                        {availableSlots.map((slot) => (
                          <ToggleGroupItem
                            key={slot}
                            value={slot}
                            className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-800 border border-gray-200"
                          >
                            {slot}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    ) : (
                      <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                        No available slots for this date
                      </p>
                    )}
                  </div>
                )}

                {/* Duration */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Duration</h3>
                  <Select value={duration.toString()} onValueChange={(value) => setDuration(Number.parseInt(value))}>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Hour</SelectItem>
                      <SelectItem value="2">2 Hours</SelectItem>
                      <SelectItem value="3">3 Hours</SelectItem>
                      <SelectItem value="4">4 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Total Price */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">Total Price</span>
                    <span className="text-2xl font-bold text-blue-600">Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {duration} hour{duration > 1 ? "s" : ""} × Rp {station.price.toLocaleString("id-ID")}/hour
                  </p>
                </div>

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Station:</strong> {station.name}
                      </p>
                      <p>
                        <strong>Date:</strong> {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: localeId })}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTime} -{" "}
                        {String(Number.parseInt(selectedTime.split(":")[0]) + duration).padStart(2, "0")}:00
                      </p>
                      <p>
                        <strong>Duration:</strong> {duration} hour{duration > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                )}

                {/* Confirm Button */}
                <Button
                  onClick={handleConfirmBooking}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
                >
                  Confirm Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
