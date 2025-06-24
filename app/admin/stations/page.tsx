"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { LayoutDashboard, Calendar, Gamepad2, Users, LogOut, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Station {
  id: number
  name: string
  type: string
  price: number
  status: string
  description: string
}

const initialStations: Station[] = [
  {
    id: 1,
    name: "PlayStation 5 - TV 1",
    type: "PS5",
    price: 50000,
    status: "Available",
    description: "Premium PS5 setup with 55-inch 4K TV",
  },
  {
    id: 2,
    name: "PlayStation 5 - TV 2",
    type: "PS5",
    price: 50000,
    status: "In Use",
    description: "Premium PS5 setup with 55-inch 4K TV",
  },
  {
    id: 3,
    name: "PlayStation 4 - TV 3",
    type: "PS4",
    price: 35000,
    status: "Available",
    description: "PS4 setup with 43-inch Full HD TV",
  },
  {
    id: 4,
    name: "PC Gaming - 01",
    type: "PC Gaming",
    price: 60000,
    status: "In Use",
    description: "High-end gaming PC with RTX 4070",
  },
  {
    id: 5,
    name: "PC Gaming - 02",
    type: "PC Gaming",
    price: 60000,
    status: "Maintenance",
    description: "High-end gaming PC with RTX 4070",
  },
  {
    id: 6,
    name: "VR Station - 01",
    type: "VR",
    price: 80000,
    status: "Available",
    description: "VR setup with Meta Quest 3",
  },
]

export default function StationManagement() {
  const [stations, setStations] = useState<Station[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    status: "Available",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [specs, setSpecs] = useState({ cpu: '', gpu: '', ram: '', storage: '' })

  useEffect(() => {
    setMounted(true)
    fetchStations()
  }, [])

  const fetchStations = async () => {
    const res = await fetch("/api/stations")
    const result = await res.json()
    setStations(result.data)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">Loading...</span>
      </div>
    )
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      price: "",
      status: "Available",
    })
    setEditingStation(null)
  }

  const handleAddNew = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (station: Station) => {
    setEditingStation(station)
    setFormData({
      name: station.name,
      type: station.type,
      price: station.price.toString(),
      status: station.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (stationId: number) => {
    if (confirm("Are you sure you want to delete this station?")) {
      await fetch("/api/stations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: stationId }),
      })
      fetchStations()
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.type || !formData.price) {
      alert("Please fill in all required fields")
      return
    }

    let image = undefined
    if (imageFile) {
      const uploadData = new FormData()
      uploadData.append('file', imageFile)
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      })
      const uploadResult = await uploadRes.json()
      if (uploadResult.success) {
        image = uploadResult.path
      } else {
        alert('Failed to upload image')
        return
      }
    }

    const stationData: any = {
      name: formData.name,
      type: formData.type,
      price: Number.parseInt(formData.price),
      status: formData.status,
      image,
    }
    if (formData.type === 'PC Gaming') {
      stationData.specs = specs
    }

    let response, result;
    if (editingStation) {
      response = await fetch("/api/stations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingStation.id, ...stationData }),
      });
    } else {
      response = await fetch("/api/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stationData),
      });
    }
    result = await response.json();

    if (result.success) {
      setIsDialogOpen(false)
      resetForm()
      setImageFile(null)
      setImagePreview(null)
      setSpecs({ cpu: '', gpu: '', ram: '', storage: '' })
      fetchStations()
    } else {
      alert("Gagal menyimpan data: " + (result.error || "Unknown error"))
      return
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "In Use":
        return "bg-blue-100 text-blue-800"
      case "Maintenance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSpecsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecs({ ...specs, [e.target.name]: e.target.value })
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
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
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
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700"
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">Stations</span>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Station Management</h1>
              <p className="text-gray-600 mt-2">Manage your game stations and their configurations</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleAddNew}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Station
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingStation ? "Edit Station" : "Add New Station"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Station Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., PlayStation 5 - TV 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Station Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select station type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PS5">PS5</SelectItem>
                        <SelectItem value="PS4">PS4</SelectItem>
                        <SelectItem value="PC Gaming">PC Gaming</SelectItem>
                        <SelectItem value="VR">VR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Rp) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="50000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="mt-2 rounded w-full max-h-40 object-contain border" />
                    )}
                  </div>

                  {formData.type === 'PC Gaming' && (
                    <div className="space-y-2">
                      <Label>PC Specs</Label>
                      <Input name="cpu" placeholder="CPU" value={specs.cpu} onChange={handleSpecsChange} className="mb-2" />
                      <Input name="gpu" placeholder="GPU" value={specs.gpu} onChange={handleSpecsChange} className="mb-2" />
                      <Input name="ram" placeholder="RAM" value={specs.ram} onChange={handleSpecsChange} className="mb-2" />
                      <Input name="storage" placeholder="Storage" value={specs.storage} onChange={handleSpecsChange} />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Save Station
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stations Table */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stations.map((station) => (
                    <TableRow key={station.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{station.name}</div>
                          <div className="text-sm text-gray-500">{station.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {station.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        Rp {station.price !== undefined && station.price !== null
                          ? station.price.toLocaleString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(station.status)}>{station.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(station)}
                            className="bg-white border-gray-300 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(station.id)}
                            className="bg-white border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
