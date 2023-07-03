const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const db = admin.firestore();
 
//// GET İŞLEMLERİ ////
app.get('/api/Agents', async (req, res) => {
  try {
    const collectionRef = db.collection('Agents');
    const snapshot = await collectionRef.get();
    const data = snapshot.docs.map((doc) => doc.data());
    res.json(data);
  } 
  catch (error) {
    console.error('Error getting collection:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});
app.get('/api/Reservations', async (req, res) => {
  try {
    const collectionRef = db.collection('Reservations');
    const snapshot = await collectionRef.get();
    const data = snapshot.docs.map((doc) => doc.data());
    res.json(data);
  } 
  catch (error) {
    console.error('Error getting collection:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//// POST İŞLEMLERİ ////
app.use(bodyParser.json());
app.post('/api/Laundry', (req, res) => {
  console.log("REG",req)
  const isActive = req.body.isActive !== undefined ? req.body.isActive : false;

  const itemData = {
    CreatedOn:req.body.CreatedOn,
    ModifiedOn:req.body.ModifiedOn,
    ModifiedUserName:req.body.ModifiedUserName,    
    isActive: true,
    title: req.body.title ,
    userID: req.body.userID ,
    
  };

  const options = { ignoreUndefinedProperties: true };
  db.collection('Laundry')
  .add(itemData, options)  
  .then(docRef => {
    console.log(itemData)
    console.log('Item added with ID:', docRef.id);
    return res.status(201).json({ message: 'Item added successfully' });
  })
  .catch(error => {
    console.error('Error adding item:', error);
    return res.status(500).json({ message: 'Error adding item' });
  });

 
  res.send('Item added successfully');
});

 //// DELETE İŞLEMLERİ ////
 app.delete('/api/Laundry/:id', (req, res) => {
  const itemId = req.params.id;

  db.collection('Laundry')
    .doc(itemId)
    .delete()
    .then(() => {
      console.log('Item deleted with ID:', itemId);
      res.status(200).json({ message: 'Item deleted successfully' });
    })
    .catch((error) => {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Error deleting item' });
    });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});