const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: "*" 
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect( 'mongodb://localhost:27017/postsdb');
// mongoose.connect( 'mongodb://localhost:27017/postsdb');

// Define a Post model
const postSchema = new mongoose.Schema({
  userId: Number,
  id : Number,
  title: String,
  body: String
  
});

const Post = mongoose.model('Post', postSchema);

// const todosSchema = new mongoose.Schema({
//   userId: Number,
//   id : Number,
//   title: String,
//   completed: Boolean
  
// });

// const Todos = mongoose.model('Todos', todosSchema);

// CRUD endpoints s

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

// app.post( '/api/todos', async (req, res) => {
//   const todos = new Todos(req.body)
//   await todos.save();
//   res.status(200).send(todos);
// });

app.get('/api/todos', async (req, res) => {
  const todos = await Post.find();
  res.json(todos);
});

app.post('/api/posts', async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.status(201).json(newPost);
});

app.patch('/api/posts/:id', async (req, res) => {
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedPost);
});

app.delete('/api/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.send('server is running on')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
