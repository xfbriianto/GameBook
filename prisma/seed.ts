const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const adminUsername = 'admin'
  const adminPassword = 'admin123'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      username: adminUsername,
    },
  })

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping admin creation.')
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log(`Admin user created successfully: ${adminUser.username}`)
  }

  // Create sample stations if they don't exist
  const stations = [
    { name: 'PlayStation 5 - TV 1', type: 'PS5', price: 50000, status: 'available' },
    { name: 'PlayStation 5 - TV 2', type: 'PS5', price: 50000, status: 'available' },
    { name: 'PlayStation 4 - TV 3', type: 'PS4', price: 40000, status: 'available' },
    { name: 'PC Gaming - 01', type: 'PC Gaming', price: 60000, status: 'available' },
    { name: 'PC Gaming - 02', type: 'PC Gaming', price: 60000, status: 'available' },
    { name: 'VR Station - 01', type: 'VR', price: 75000, status: 'available' },
  ]

  for (const stationData of stations) {
    const existingStation = await prisma.station.findFirst({
      where: { name: stationData.name }
    })

    if (!existingStation) {
      const station = await prisma.station.create({
        data: stationData
      })
      console.log(`Station created: ${station.name}`)
    }
  }

  // Create a sample user for testing
  const testUser = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
    },
  })

  console.log(`Test user created/updated: ${testUser.username}`)

  // Create sample bookings
  const sampleBookings = [
    {
      stationId: 1,
      userId: testUser.id,
      date: new Date('2024-01-15'),
      time: '14:00',
      duration: 2,
      totalPrice: 100000,
      status: 'confirmed',
    },
    {
      stationId: 4,
      userId: testUser.id,
      date: new Date('2024-01-16'),
      time: '16:00',
      duration: 1,
      totalPrice: 60000,
      status: 'in-progress',
    },
  ]

  for (const bookingData of sampleBookings) {
    const existingBooking = await prisma.booking.findFirst({
      where: {
        stationId: bookingData.stationId,
        userId: bookingData.userId,
        date: bookingData.date,
        time: bookingData.time,
      }
    })

    if (!existingBooking) {
      const booking = await prisma.booking.create({
        data: bookingData
      })
      console.log(`Sample booking created for station ${booking.stationId}`)
    }
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 