// Creating the server
const express = require('express');
// const cors = require("cors");
const postsRouter = require('../posts/posts-router.js');

const server = express(); // express obj

// server.use(cors());
server.use(express.json());

server.use('/api/posts', postsRouter); // middleware
// server.use('/posts', postsRouter);

// server.get('/', (req, res) => {
//   res.send('We are receiving data from Blogs Post API')
// })

// Defining all of the endpoints
// json - clearer to the developer 
// you are not writing source code for the computer
// source code is for the communication medium for future myself or another human developer - just .send, that's not clear
server.get('/', (req, res) => {
  res.send(`
    <h2>Blog Posts API</h2>
    <p>Welcome to the Blog Posts API</p>
  `);
});
// server.get('/', (req, res) => {
//   const query = req.query;
//   console.log('query', query)
//   res.status(200).json(query);
// });

//! MOST CRITICAL PART
// The router handles endppoints that begins with /api/posts
server.use('/api/posts', postsRouter);

// in the server, I don't want to handle all of the routers
// Break up by feature or by resource. Blogs is a resource. 
module.exports = server; // exporting server
