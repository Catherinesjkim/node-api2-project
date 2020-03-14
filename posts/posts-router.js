// How to create a router
const express = require('express');

const Posts = require("../db.js");

// notice the uppercase R
const router = express.Router(); // invoke Router()

// the router handles endpoints that begin with /api/posts
// router only cares about what comes afater /api/posts

// POST	/api/posts	Creates a post using the information sent inside the request body.
// req.body
router.post("/", (req, res) => {});

// POST	/api/posts/:id/comments	- Creates a comment for the post with the specified id using information sent inside of the request body.
router.post("/:id/comments", (req, res) => {});

// GET /api/posts - Returns an array of all the post objects contained in the database.
// .send will also work because express framework will turn it into .json
router.post("/", (req, res) => {
  Blogs.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the blogs",
      });
    });
});

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get("/:id", (req, res) => {});

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get("/:id", (req, res) => {});

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete("/:id", (req, res) => {});

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put("/:id", (req, res) => {});

module.exports = router;