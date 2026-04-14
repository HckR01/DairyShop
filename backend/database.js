const { MongoClient } = require('mongodb');

// Connection URL

const url = "mongodb+srv://sarojkumarbaral6338_db_user:Dairy1234@dairyfarm.z3ugoho.mongodb.net/?appName=dairyfarm";
const client = new MongoClient(url);

// Database Name
const dbName = 'User';

async function main() {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('userInfo');
    //read
    const findResult = await collection.find({}).toArray();
console.log('Found documents =>', findResult);

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());