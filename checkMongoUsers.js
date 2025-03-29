const mongodb = require('mongodb');

async function checkMongoUsers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const client = new mongodb.MongoClient('mongodb://localhost:27017/');
    await client.connect();
    
    // Get the database
    const db = client.db('rasoi_basket');
    
    // Get the users collection
    const usersCollection = db.collection('users');
    
    // Find all users
    const users = await usersCollection.find({}).toArray();
    
    console.log(`Found ${users.length} users in MongoDB:`);
    console.log(JSON.stringify(users, null, 2));
    
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkMongoUsers(); 