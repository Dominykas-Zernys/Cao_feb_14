const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const url = process.env.url;
const { MongoClient } = require('mongodb');
const client = new MongoClient(url);
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.get('/users', async (req, res) => {
  try {
    const connection = await client.connect();
    const usersData = await connection
      .db('caoFeb14')
      .collection('users')
      .find()
      .toArray();
    connection.close();
    res.json({ msg: 'success', data: usersData });
  } catch (error) {
    res.send({ msg: 'something went wrong', data: error });
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const connection = await client.connect();
    const usersData = await connection
      .db('caoFeb14')
      .collection('users')
      .insertOne(newUser);
    connection.close();
    res.json({ msg: 'success', data: newUser });
  } catch (error) {
    res.send({ msg: 'something went wrong', data: error });
  }
});

app.listen(PORT, console.log('server is running on port ' + PORT));
