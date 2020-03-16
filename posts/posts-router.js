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
If there's an error in retrieving the posts from the database: cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The posts information could not be retrieved." }.
*/
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then(posts => {
      res.status(200).json(posts); // Worked on Postman - return an array of all the post obj
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).end.json({
        error: "The posts info could not be retrieved",
      }); // Not possible to reproduce this error on postman for GET request
    });
});
// Worked on Postman

// MH
// router.get('/', (req, res) => {
//   Posts.getAll() // promise - whenever need to go to db to get info
    // .then(posts => {
    //   res.status(200).json(posts)
    // })
    // .catch(err => {
    //   res.status(500).json({ message: "We did not get the posts" }) // internal server error - cannot reproduce 500 error on postman for GET - You can do it on POST & PUT
//     })
// })

// GET/api/posts/:id - Returns the post object with the specified id.
// If the post with the specified id is not found:
// return HTTP status code 404 (Not Found)?
// return the following JSON object: { message: "The post with the specified ID does not exist." } Done
// If there's an error in retrieving the post from the database: 
//? cancel the request with .end? - respond with HTTP status code 500 - Not getting this response on postman
// return the following JSON object: { error: "The post information could not be retrieved." }
// every dynamic param in the URL, it's going to show up in req.params.id - promise .then - always use promise when using a db. 
router.get("/:id", (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then(post => {
      res.status(200).json(post) // http:localhost:5000/api/posts/:id - Worked on postman
        res
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
      }); // Not possible to reproduce this error on postman for GET request
    });
});
// Worked on Postman

// POST	/api/posts - Creates a post using the info sent inside the req.body & insert(post)
// If the req.body is missing the title or contents property: cancel the request.
// respond with HTTP status code 400 (Bad Request).
// return the following JSON response: { errorMessage: "Please provide title and contents for the post." }
// ## post: { title:'I wish the ring had never come to me. I wish none of this had happened.', contents: 'Guess who said this' } 

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
      res.status(500).json({ // Server error responose - possible to do 500 error on postman for POST request
        error: "There was an error while saving the post to the database",
      });
    });
});
// Working on Postman

// MH
// router.post('/', (req, res) => {
//   console.log(req.body)
//   Posts.insert(req.body)
//     .then(post => {
//       res.status(201).json(req.body)
//     })
//     .catch(err => {
//       res.status(500).json({ message: 'Server Error on POST' }) // "Body is undefined"" for no reason, it's JSON middleware
//     })
// })

// POST	/api/posts/:id/comments	- Creates a comment for the post with the specified id using information sent inside of the request body.
/*
## If the post with the specified id is not found:
return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The post with the specified ID does not exist." }.
## If the request body is missing the text property: cancel the request. .end
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
  const { text, post_id } = req.body;

  !post_id ? res.status(404).json({ errorMessage: "The post with the specified ID does not exist." }) // if the post with id is not found (Not Found)

  : Posts
    .insertComment(comment) // saves the new comment to the db
    .then(data => {
      if(data) {
        res.status(201).json({ text, post_id }) // If the info re: comment is valid, save the new comment to the db
      } if (!text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." // if the request body is missing the text property (Bad Request)
        });
      }
    }) // add your if (!text) conditional to the top of the .catch block
    .catch(err => {
      console.log(error);
      res.status(500).json({ errorMessage: "There was an error while saving the comment to the database"
      }); // POST request is possible to do 500 error on postman
    })
});
// Need to test on Postman


// GET	/api/posts/:id/comments	- Returns an array of all the comment objects associated with the post with the specified id.
/* 
## If the post with the specified id is not found:
return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The post with the specified ID does not exist." }.
## If there's an error in retrieving the comments from the database: cancel the request. .end
respond with HTTP status code 500.
return the following JSON object: { error: "The comments information could not be retrieved." }.

comments {text: "Let your workings remain a mystery. Just show people the results.", post_id: 1},
*/
// router.get("/:id/comments", (req, res) => {
//   const { text, post_id } = req.query;
//   !post_id ? res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
//     : Posts
//       .insertComment({ text, post_id })
//       .then(data => {
//         if (data) {
//           res.status(201).json({ text, post_id }) // Success: returns an array of all of the comment obj {text, post_id}
      // });
      // .catch(err => {
      //   console.log(error);
      //   res.status(500).end.json(
      //     { error: "The comments info could not be retrieved"}); // if there's an error in retrieving the comments from db, cancel the request. 
//       });
//     });
// });

// DELETE	/api/posts/:id - Removes the post with the specified id and 
//? returns the deleted post object. 
//? You may need to make additional calls to the database in order to satisfy this requirement.
// When the client makes a DELETE request to /api/posts/:id:

// If the post with the specified id is not found: return HTTP status code 404 (Not Found) & return the following JSON object: { message: "The post with the specified ID does not exist." }.

// If there's an error in removing the post from the database: cancel the request, respond with HTTP status code 500. return the following JSON object: { error: "The post could not be removed" }.
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.remove(id)
    .then(deleted => {
      if (deleted) {
      res.status(200).json(
        { message: `Post ${id} was deleted.`, 
          deleted 
        }); // the id was deleted successfully - response back with id - returns #1 on postman
    } else {
        res.status(404).json(// Not found - the id didn't exist in the first place 
        { message: "The post with the specified ID does not exist."});
        }
      })
      .catch(err => { // catch all for the exceptions
        res.status(500).json(
          { errorMessage: "The user could not be removed" }) // Delete server error
      })
})
// Worked on Postman

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

  Posts.update(changes, id)
    .then(updated => {
      if (updated) {
        res.status(200).json({ message: "Successfully Updated", changes });
      } else {
        res
          .status(404)
          .json({
            message: "The post with the specified ID does not exist.",
          });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post information could not be modified." }); // PUT request is possible to do 500 error on postman
    });
});
// Worked postman

module.exports = router;