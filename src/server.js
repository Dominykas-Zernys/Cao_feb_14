const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const url = process.env.url;
const { MongoClient } = require('mongodb');
const client = new MongoClient(url);
const morgan = require('morgan');
const { ObjectId } = require('mongodb');

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

app.get('/comments', async (req, res) => {
  try {
    const connection = await client.connect();
    const commentsData = await connection
      .db('caoFeb14')
      .collection('comments')
      .find()
      .project({ _id: 0 })
      .toArray();
    const usersData = await connection
      .db('caoFeb14')
      .collection('users')
      .find()
      .toArray();
    const commentsDataWithAuthors = [];
    commentsData.map((comment) => {
      const foundUser = usersData.find(
        (userData) => userData._id.toString() == new ObjectId(comment.user_id)
      );
      comment.user = foundUser.name;
      delete comment.user_id;
      commentsDataWithAuthors.push(comment);
    });

    await connection.close();
    res.json({ msg: 'success', data: commentsDataWithAuthors });
  } catch (error) {
    res.send({ msg: 'something went wrong', data: error });
  }
});

app.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await client.connect();
    const usersData = await connection
      .db('caoFeb14')
      .collection('comments')
      .deleteOne({ _id: new ObjectId(id) });
    connection.close();
    res.json({ msg: 'success', data: usersData });
  } catch (error) {
    res.send({ msg: 'something went wrong', data: error });
  }
});

app.listen(PORT, console.log('server is running on port ' + PORT));
