const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const upload = require('./middelware/multerUplode');
const path = require('path');

const app = express();
app.use(cors({
  origin: "*" 
}));
app.use(express.json());
// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect( 'mongodb://localhost:27017/postsdb');
// mongoose.connect( 'mongodb://localhost:27017/postsdb');

// Define a Post model
const blogSchema = new mongoose.Schema({
  userId: Number,
  id : Number,
  title: String,
  body: String,
  image:Object

  
});

const Blog = mongoose.model('Blog', blogSchema);

// const todosSchema = new mongoose.Schema({
//   userId: Number,
//   id : Number,
//   title: String,
//   completed: Boolean
  
// });

// const Todos = mongoose.model('Todos', todosSchema);

// CRUD endpoints s

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json(blogs);
});

app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});



// app.post( '/api/todos', async (req, res) => {
//   const todos = new Todos(req.body)
//   await todos.save();
//   res.status(200).send(todos);
// });

// app.get('/api/todos', async (req, res) => {
//   const todos = await Blog.find();
//   res.json(todos);
// });

app.post('/api/blogs', upload, async (req, res) => {
  const {title,body}=req.body
  const profile=req.file
  const blog={title,body,image:profile}
  const newBlog = new Blog(blog);
  // console.log(newBlog,"-------------------this is new blog",title,profile)


  await newBlog.save();
  res.status(201).json(newBlog);
});

app.patch('/api/blogs/:id', async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedBlog);
});

app.delete('/api/blogs/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.send('server is running on')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
