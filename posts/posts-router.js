// How to create a router
const express = require('express'); 
const Posts = require("../db.js");
// const express = require('../posts/posts-model'); // analogous to db

// notice the uppercase R
const router = express.Router(); // invoke Router()

// the router handles endpoints that begin with /api/posts
// router only cares about what comes afater /api/posts

// GET /api/posts - Returns an array of all the post objects contained in the database.
// .send will also work because express framework will turn it into .json
/*
Just 200 & 500 for GET request
If there's an error in retrieving the posts from the database: cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The posts information could not be retrieved." }.
*/
router.get("/", (req, res) => {
  Posts
    .find(req.query)
    .then(posts => {
      res.status(200).json(posts); // Worked on Postman - return an array of all the post obj
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).end.json({
        error: "The posts info could not be retrieved",
      }); // Not possible to reproduce this error on postman for GET request unless manipulated in db.js
    });
});
// Worked on Postman

// GET/api/posts/:id - Returns the post object with the specified id.
// ## If the post with the specified id is not found:
// return HTTP status code 404 (Not Found)?
// return the following JSON object: { message: "The post with the specified ID does not exist." } Done
// ## If there's an error in retrieving the post from the database: 
// cancel the request with - respond with HTTP status code 500
// return the following JSON object: { error: "The post information could not be retrieved." }
// every dynamic param in the URL, it's going to show up in req.params.id - promise .then - always use promise when using a db. 
router.get("/:id", (req, res) => {
  const { id } = req.params;

  Posts
    .findById(id)
    .then(post => {
      post ? // does it exist? 
      res.status(200).json(post) // http:localhost:5000/api/posts/:id - Worked on postman
        : res // else
          .status(404) // Not Found - worked on postman -  .first(); in db.js 
          .json({
            message: "The post with the specified ID does not exist",
          });
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).end.json({
        message: "The post information could not be retrieved." 
      }); // Not possible to reproduce this error on postman for GET request unless manipuated on db.js
    });
});
// Worked on Postman

// POST	/api/posts - Creates a post using the info sent inside the req.body & insert(post)
// If the req.body is missing the title or contents property: cancel the request.
// respond with HTTP status code 400 (Bad Request).
// return the following JSON response: { errorMessage: "Please provide title and contents for the post." }
// post: { title:'I wish the ring had never come to me. I wish none of this had happened.', contents: 'Guess who said this' } 
router.post("/", (req, res) => {
  const { title, contents } = req.body;

  !title || !contents // either or - if one of them is missing, err
  ? res.status(400).json({ errorMessage: "Please provide title and contents for the post." }) // Bad Request response - Worked on postman
  : Posts
    .insert(req.body)
    .then(post => {
      res.status(201).json(req.body); // Created - Successful response - working on postman
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({ // Inner server error response
        error: "There was an error while saving the post to the database",
      });
    });
});
// Working on Postman

// DELETE	/api/posts/:id - Removes the post with the specified id and 
//? returns the deleted post object. 
//? You may need to make additional calls to the database in order to satisfy this requirement.
// When the client makes a DELETE request to /api/posts/:id:

// If the post with the specified id is not found: return HTTP status code 404 (Not Found) & return the following JSON object: { message: "The post with the specified ID does not exist." }.
// If there's an error in removing the post from the database: cancel the request, respond with HTTP status code 500. return the following JSON object: { error: "The post could not be removed" }.
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Posts
    .findById(id)
    .then(post => {
      post ? 
        Posts
          .remove(id)
          .then(deleted => {
            deleted ? 
            res.status(200).json({ message: `Post ${id} was deleted`, info: (post) }) 
          : res.status(404).json({ message: "The post with the specified ID does not exist."}); 
        })
      : null
      })
      .catch(err => { // catch all for the exceptions
        res.status(500).json(
          { message: "The post could not be removed" }) // Delete server error
      })
})
// Worked on Postman

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
/*
## If the post with the specified id is not found: return HTTP status code 404 (Not Found). return the following JSON object: { message: "The post with the specified ID does not exist." }.

## If the request body is missing the title or contents property: cancel the request.
respond with HTTP status code 400 (Bad Request).
return the following JSON response: { errorMessage: "Please provide title and contents for the post." }.
If there's an error when updating the post: cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The post information could not be modified." }.
## If the post is found and the new information is valid:
update the post document in the database using the new information sent in the request body.
return HTTP status code 200 (OK).
return the newly updated post.
*/
router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  const id = req.params.id;
  const changes = req.body;

  !title || !contents // either or - if one of them is missing, err
  ? res.status(400).json({ errorMessage: "Please provide title and contents for the post." }) // Bad Request response - Worked on postman

  : Posts
    .update(id, req.body)
    .then(post => {
      post ? 
        res.status(200).json(req.body) :
        res
          .status(404)
          .json({
            message: "The post with the specified ID does not exist.",
          });
    })
    .catch(err => {
      res.status(500).json({ error: "The post information could not be modified." }); 
    });
  });
// Worked postman


// Comments endpoints start here

// POST	/api/posts/:id/comments	- Creates a comment for the post with the specified id using info sent inside of the request body.
/*
## If the post with the specified id is not found:
return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The post with the specified ID does not exist." }.
## If the request body is missing the text property: cancel the request. 
respond with HTTP status code 400 (Bad Request).
return the following JSON response: { errorMessage: "Please provide text for the comment." }.
## If the information about the comment is valid: save the new comment to the database.
return HTTP status code 201 (Created).
return the newly created comment.
## If there's an error while saving the comment: cancel the request.
respond with HTTP status code 500 (Server Error).
return the following JSON object: { error: "There was an error while saving the comment to the database" }.
## comment {text: "Let your workings remain a mystery. Just show people the results.", post_id: 1},
*/
router.post("/:id/comments", (req, res) => {
  const { text } = req.body; // pulling out one piece out of the db.js
  const post_id = req.params.id; // this dynamic id from above is going to come from the URL - params

  !text ? // Not Text? 
      res.status(400).json({ errorMessage: "Please provide text for the comment." }) // if the request body is missing the text property (Bad Request) - worked on postman
  : Posts.findById(post_id) // : else
    .then(post => {
      if (!post) { res.status(404).json({ error: "The post with the specified ID does not exist." }) // working on postman
    } else {
      let newComment = {
        text: text, post_id: post_id
      }
      Posts.insertComment(newComment) // saves the new comment to the db
        .then(({ id }) => {
      Posts.findCommentById(id)
        .then(comment => {
          res.status(201).json(comment) // If the info re: comment is valid, save the new comment to the db - worked on postman
      });
    }) // add your if (!text) conditional to the top of the .catch block
    .catch(err => {
      console.log(error);
      res.status(500).json({ errorMessage: "There was an error while saving the comment to the database"
        })
      })
    } // POST request is possible to do 500 error on postman
  })
});
// Working on Postman


/* 
GET	/api/posts/:id/comments	- Returns an array of all the comment objects associated with the post with the specified id.
## If the post with the specified id is not found:
return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The post with the specified ID does not exist." }.
## If there's an error in retrieving the comments from the database: cancel the request. .end
respond with HTTP status code 500.
return the following JSON object: { error: "The comments information could not be retrieved." }.
comments {text: "Let your workings remain a mystery. Just show people the results.", post_id: 1},
First data base method
*/
// router.get('/:postid/comments/:id', (req, res) => {
//   const id = req.params.postid;
//   const info = req.body;

//  db.findCommentById(id)
//   .then(comment => {
//     console.log("Comment: ", comment);
//     console.log("Post ID: ", postId);
//     console.log("Comment Post ID: ", comment[0].post_id);

//     // postId came out of an URL, so it's a string
//     Number(postId) !== comment[0].post_id
//     ? res.status(404).json({ success: false, message: "Comment not found" })
//     : res.status(200).json(comment)
//   }) 
//   .catch(error => {
//     res.status(500).json({ success: false, message: 'Comment not found', error })
//   })
//   .delete((req, res) => {
//     db.removeComment(req.params.id)
//       .then(comment => {
//         res.status(200).json({ success: true, message: "Comment deleted", comment})
//       })
//       .catch(error => {
//         res.status(500).json({ success: false, message: "Comment not deleted", error })
//       })
//   });
// })

router.get('/:id/comments', (req, res) => {
  const { id } = req.params
  
  Posts
    .findPostComments(id)
    .then(data => { // 200 response working on postman
      data ? 
        res.status(200).json(data) 
      : res.status(404).json({ message: 'The Post ID Does NOT Exist.' }) // 404 working on postman
    }) // If there's data, return 200. If not, return 404
    .catch(err => {
      res.status(500).json({
        message: 'The comments information could not be retrieved.',
      })
    })
})
// Working on Postman

module.exports = router;