import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3000;

const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.err(err.message)
  }
  console.log('connected to the Sqlite3 database')
})

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);


app.post('/api/register', (req, res) => {
  const {email, password} = req.body
  db.get(' SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (row) {
      return res.status(400).json({message: 'email is valiable!'})
    }
    const hashedpw = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedpw], function(err) {
      if(err) {
        return res.status(300).json({message: 'can not register please try again'})
      }
      res.status(200).json({message: 'done'})
    })
  })
})


app.post('/api/login', (req, res) => {
  const {email, password} = req.body

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({message: 'Email or password is incorrect'})
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({message: 'email or password is incorrect'})
    }
    res.status(200).json({message: 'done'})
  })
})

app.post('/api/notifi', (req, res) => {
  const {mess} = req.body;
  res.status(200).json({status: 'success', mess:'completed successfully!'})
})

app.get('/api/data', (req, res) => {
  res.json({
    data: [
      { namefood: 'burger', price: '50', image: 'assets/burger.jpg' },
      { namefood: 'French fries', price: '20' , image: 'assets/fried_french.jpg'},
      { namefood: 'Fried chicken', price: '30', image: 'assets/chicken_fried.jpg'},
      { namefood: 'Chicken wings', price: '40', image: 'assets/sandwich.jpg' },
      { namefood: 'Chicken pasta', price: '10', image: 'assets/chicken_pasta.jpg' },
      { namefood: 'sandwich', price: '20', image: 'assets/sandwich.jpg'},
      { namefood: 'bread', price: '1', image: 'assets/bread.jpg'},
      { namefood: 'salad', price: '10', image: 'assets/salad.jpg'},
      { namefood: 'Beef steeak', price: '200', image: 'assets/beef_steak.jpg'},
      { namefood: 'Pizza', price: '100', image: 'assets/pizza.jpg' },
    ],
    restaurant: [
      
      {address: '32 To Huu - Da Nang', image: 'assets/burger.jpg' ,name: 'burger-Chicken pasta', acountstar: 4.2, time: 20},            
      {address: '32 Bach Dang - Da Nang', image: 'assets/fried_french.jpg',name: 'French fries-French fries',acountstar: 4.2, time: 20},
      {address: '32 Hai Phong - Da Nang', image: 'assets/chicken_fried.jpg',name: 'Fried chicken-burger',acountstar: 4.2, time: 20},
      {address: '32 Doan Uan - Da Nang', image: 'assets/sandwich.jpg', name: 'Chicken wings-Fried chicken',acountstar: 4.2, time: 20},
      {address: '32 Quang Nam - Da Nang',  image: 'assets/chicken_pasta.jpg',name: 'Chicken pasta-French fries',acountstar: 4.2, time: 20},
      {address: '32 Dong Da - Da Nang',  image: 'assets/sandwich.jpg',name: 'sandwich-French fries',acountstar: 4.2, time: 20},
      {address: '32 Ham Nghi - Da Nang', image: 'assets/bread.jpg',name: 'bread-Chicken wings',acountstar: 4.2, time: 20},
      {address: '32 Phan Dang Luu - Da Nang', image: 'assets/salad.jpg',name: 'salad-French fries',acountstar: 4.2, time: 20},
      {address: '55 To Huu - Da Nang',  image: 'assets/beef_steak.jpg',name: 'Beef steeak-French fries',acountstar: 4.2, time: 20},
      {address: '100 To Huu - Da Nang',  image: 'assets/pizza.jpg',name: 'Pizza-burger-French fries'  ,acountstar: 4.2, time: 20}  ,        
      
    ]
  });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});