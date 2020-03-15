// How to create a router
const express = require('express');

const Posts = require("../db.js");

// notice the uppercase R
const router = express.Router(); // invoke Router()

// the router handles endpoints that begin with /api/posts
// router only cares about what comes afater /api/posts

// POST	/api/posts - Creates a post using the information sent inside the request body - req.body & insert(post)
// If the request body is missing the title or contents property: cancel the request.
// respond with HTTP status code 400 (Bad Request).
// return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.
router.post("/", (req, res) => {

  const {title, contents} = req.body
  !title || !contents // either or - if one of them is missing, err
  ? res.status(400).json({ errorMessage: "Please provide title and contents for the post. "}) // Bad Request response 

  : Posts
    .insert(post)
    .then(post => {
      res.status(201).json(posts); // Created - Successful response
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({ // Server error responose
        error: "There was an error while saving the post to the database",
      });
    });
});
// Postman: keep getting 404 error response


// POST	/api/posts/:id/comments	- Creates a comment for the post with the specified id using information sent inside of the request body.
router.post("/:id/comments", (req, res) => {
  const { text, post_id } = req.body;

  !post_id ? res.status(404).json({ success: false, errorMessage: "The post with the specified ID does not exist." })

  : Posts
    .insertComment({ text, post_id })
    .then(data => {
      if(data) {
        res.status(201).json({ text, post_id })
      } if (!text){
        res.status(400).json({ success: false, errorMessage: "Please provide text for the comment." 
        });
      }
    }) // add your if (!text) conditional to the top of the .catch block
    .catch(err => {
      console.log(error);
      res.status(500).json({ success: false, errorMessage: "There was an error while saving the comment to the database", err
      });
    })
});
// Need to test on Postman


// GET /api/posts - Returns an array of all the post objects contained in the database.
// .send will also work because express framework will turn it into .json
router.get("/", (req, res) => {
  
  Posts.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});
// Worked on Postman

// GET/api/posts/:id - Returns the post object with the specified id.
// If the post with the specified id is not found:
// return HTTP status code 404 (Not Found)?
// return the following JSON object: { message: "The post with the specified ID does not exist." } Done
// If there's an error in retrieving the post from the database: 
//? cancel the request with .end? - respond with HTTP status code 500 - Not getting this response on postman
// return the following JSON object: { error: "The post information could not be retrieved." }
// every dynamic param in the URL, it's going to show up in req.params.id - promise .then - always use promise when using a db. 
router.get("/:id", (req, res) => { 
  const { id } = req.params.id;
  Posts.findById({ id }) 
    .then(post => {
      post
        ? res.status(200).json(post) // http:localhost:5000/api/posts/:id - Worked on postman
        : res
          .status(404) // Not Found
          .json({
            message: "The post with the specified ID does not exist",
          }); 
      })
      .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).end.json({
        message: "The post information could not be retrieved.", success: false 
      });
    });
});
//? Postman: when I send a /api/posts/50 GET request, I still get a 200 OK respoonse with []

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get("/:id/comments", (req, res) => {

});

// DELETE	/api/posts/:id - Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
// When the client makes a DELETE request to /api/posts/:id:

// If the post with the specified id is not found: return HTTP status code 404 (Not Found) & return the following JSON object: { message: "The post with the specified ID does not exist." }.

// If there's an error in removing the post from the database: cancel the request, respond with HTTP status code 500. return the following JSON object: { error: "The post could not be removed" }.
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then(deleted => {
      if (deleted) {
      res.status(204).end(); // the id was deleted - response without any data
    } else {
      res.status(404).json(// Not found - the id didn't exist in the first place 
      { success: false, 
        message: "The post with the specified ID does not exist." 
        });
      }
    })
    .catch(err => { // catch all for the exceptions
      res.status(500).json(
        { success: false, 
          errorMessage: "The user could not be removed"
        })
    })
})
// Need to test on Postman

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
/*
If the post with the specified id is not found: return HTTP status code 404 (Not Found). return the following JSON object: { message: "The post with the specified ID does not exist." }.

If the request body is missing the title or contents property: cancel the request.
respond with HTTP status code 400 (Bad Request).
return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.

If there's an error when updating the post: cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The post information could not be modified." }.
If the post is found and the new information is valid:

update the post document in the database using the new information sent in the request body.
return HTTP status code 200 (OK).
return the newly updated post.
*/
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  posts.update(id, posts)
    .then(updated => {
      if (updated) {
        res.status(200).end();
      } else {
        res
          .status(404)
          .json({
            success: false,
            message: "The post with the specified ID does not exist.",
          });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});
// Need to test on postman

module.exports = router;