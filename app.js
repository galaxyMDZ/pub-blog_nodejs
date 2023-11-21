/* To access this file, do 
1. an npm start command from the the folder where the app.js file is 
2. then go to the browser and type in localhost:6001 or check app(dot)listen to know the port

*/


// Import the required modules
const express = require('express');
const { default: mongoose } = require('mongoose');
const morgan = require('morgan');
const Blog = require('./models/blogSchema');

// Create an instance of the Express application
const app = express();

// Connect to MongoDB server as a variable
const db = "mongodb+srv://user:user@cluster0.zhd5x0k.mongodb.net/Node?retryWrites=true&w=majority";

// Use mongoose to connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
 .then((result) => {
    console.log('Listening on port localhost:6001');
    app.listen(6001);                    // show app on localhost:6001
  })
 .catch((err) => console.error(err));


// Set the view engine to EJS
app.set("view engine", "ejs");
// Adding a static file from a particular folder, the css file
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
// Use the morgan middleware to log HTTP requests and responses in the console
app.use(morgan('dev'));



// Define a middleware function that logs the hostname of the request and calls the next middleware function
app.use((req,res, next) => {
  console.log('host:', req.hostname);
  next();
})

// Define a middleware function that logs the request using the morgan middleware
app.use((req, res, next) => {
  console.log('Someone is viewing the site .......');                 // ???????? why was this necessary?
  next();
});

// Define a middleware function that sets a path property on the res.locals object and calls the next middleware function
app.use((req, res, next) => {
  console.log( res.locals.path = req.path)      // ???????????? what path?
  next()
})

//     // Add routing table to the root folder
//     app.get('/', (req, res, next) => {
//       res.redirect('/blogs');
//     })
    
//     // Define a route for the /about URL that renders the about view
//     app.get('/about', (req, res) => {
//       res.render('about', {title: 'about'})
//     });
    
//     // Define a route for the /blog/create URL that renders the create view

//     app.get('/blogs/create', (req, res) => {
//       res.render('create', {title:' Create new blog'})
//     }); 

//     // Define a search category for all blog categories

//     app.get('/blogs', (req, res) => {
//       Blog.find().then(result => {
//     res.render('index', {blogs: result, title: 'All blogs'})
//   }).catch(err => {
//     console.log(err)
//   })
// })

// Create middleware for creating posts

app.post('/blogs', (req, res) => {
  try {
    const blog = new Blog(req.body);
    blog.save().then(result => {
      res.redirect('/blogs');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating blog');
  }
});

// Find a blog by id
app.get('/blogs/:id', (req, res) => {
  const id =req.params.id;
  Blog.findById(id).then(result => {
    res.render('detail', {blog: result, title: 'Blog Details'});
  }).catch(err => {
      console.log(err)
    });
})

// Function to delete a blog post
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => res.json({ redirect: '/blogs'}))
    .catch(err => {
      console.log(err);
    });
});

// app.delete('/blogs/:id', (req, res) => {
//   const id = req.params.id;
//   Blog.findByIdAndDelete().then(result => res.json({ redirect: '/'})).catch(err => {
//     console.log(err);
//   });
// });



// Define a route for any other URL that renders the 404 view

app.use((req, res) => {
  res.status(404).render('404', {title: 'Page not found'});
})
