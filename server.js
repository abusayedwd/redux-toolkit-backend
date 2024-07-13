const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const upload = require('./middelware/multerUplode');
const path = require('path');
const { log } = require('console');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: "*" 
}));
app.use(express.json());
// Serve static files from the 'public' directory
// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

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

const todosSchema = new mongoose.Schema({
  userId: Number,
  id : Number,
  title: String,
  completed: Boolean
  
});

const Todos = mongoose.model('Todos', todosSchema);

// CRUD endpoints s

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json(blogs);
});

app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});



app.post( '/api/todos', async (req, res) => {
  const todos = new Todos(req.body)
  await todos.save();
  res.status(200).send(todos);
});

app.get('/api/todos', async (req, res) => {
  const todos = await Todos.find();
  res.json(todos);
});

app.post('/api/blogs', upload, async (req, res) => {
  const {title,body}=req.body
  const image=req.file
     console.log(image)
  const files = {}; // Initialize files as an object

  // Check if there are uploaded files
  if (image) {
    const publicFileUrl = `/images/users/${image.filename}`;
    const simplifiedPath = image.filename; // Assuming you want just the filename
  
    // Assign properties directly to 'files' object
    files.publicFileUrl = publicFileUrl;
    files.path = simplifiedPath;
  } 
  const blog={title,body,image:files}
  const newBlog = new Blog(blog);
  // console.log(newBlog,"-------------------this is new blog",title,image)


  await newBlog.save();
  res.status(201).json(newBlog);
});

app.patch('/api/blogs/:id', upload, async (req, res) => {
  console.log(req.params.id);
  const {title , body} = req.body;
  const image = req.file || {};
  console.log(req?.body);
  // console.log("=========>",image)

  const files = {}

  if (image) {
    const publicFileUrl = `/images/users/${image.filename}`;
    const simplifiedPath = image.filename; // Assuming you want just the filename
  
    // Assign properties directly to 'files' object
    files.publicFileUrl = publicFileUrl;
    files.path = simplifiedPath;
  } 
  const blog ={title,body,image:files}
  // console.log(blog);

  const findBlog  = await Blog.findById(req.params.id)
  if(!findBlog){
    return res.status(404).json({message: 'error blog not found'})
  }
  findBlog.title = title || findBlog.title 
  findBlog.body = body || findBlog.body
  findBlog.image =  files || findBlog.image

   
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, findBlog, {
    new: true,
  });
  res.status(201).json(updatedBlog);
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
