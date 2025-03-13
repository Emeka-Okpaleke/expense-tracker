import mongoose from "mongoose"
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/expense-tracker"

// Define the global mongoose cache type
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Add mongoose to global type
declare global {
  var mongoose: MongooseCache | undefined
}

// Initialize the cached connection
const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

// Add mongoose to global if it doesn't exist
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    // Use the imported mongoose, not the cached one
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      return mongoose
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

