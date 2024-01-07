import { MongoClient } from "mongodb";

// /api/new-meetup

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    // const { title, image, address, description } = data;

    const client = await MongoClient.connect('mongodb+srv://dazaizaoldyck:zmgn7GQU0vwG5ImF@cluster0.4iibv2q.mongodb.net/?retryWrites=true&w=majority')
    
    const db = client.db();

    const meetupsCollection = db.collection('meetups');
    
    const result = await meetupsCollection.insertOne(data);

    console.log(result)

    setTimeout(() => {client.close()}, 1500);

    res.status(201).json({
      message: 'Meetup inserted!'
    });

  }
}

export default handler;