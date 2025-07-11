// Database initialization script
// Run this with: node scripts/init-database.js

const { MongoClient } = require("mongodb")

const uri = "mongodb+srv://arnabshikder2001:6U1ZuMzSvIysxyHf@cluster0.uhdhdcq.mongodb.net/attendance?retryWrites=true&w=majority&ssl=true"

async function initializeDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB Atlas")

    const db = client.db("attendance")

    // Create collections if they don't exist
    const collections = ["users", "teams", "attendance"]

    for (const collectionName of collections) {
      const exists = await db.listCollections({ name: collectionName }).hasNext()
      if (!exists) {
        await db.createCollection(collectionName)
        console.log(`Created collection: ${collectionName}`)
      } else {
        console.log(`Collection already exists: ${collectionName}`)
      }
    }

    // Create indexes for better performance
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("teams").createIndex({ code: 1 }, { unique: true })
    await db.collection("attendance").createIndex({ userId: 1, date: 1 }, { unique: true })

    console.log("Database indexes created successfully")
    console.log("Database initialization completed!")
  } catch (error) {
    console.error("Database initialization error:", error)
  } finally {
    await client.close()
  }
}

initializeDatabase()
