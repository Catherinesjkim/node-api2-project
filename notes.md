| We are going to talk about middleware in a few days
| We are going to learn bout DB in 2 weeks

| Why do we need server-side routing? request coming through the server, someone has to handle it. 
| Router is the librarian. Nobody gets the books without a librarian. Interface to the outside world
| Router is the API for my API - it's right in between the client and server  
| routing opens the door and says "What do you need? - Interface to the outside world

## Routing engine is going to look at 2 things (function with the hommies: req, res)

| What URL are they looking at and which HTTP method (verb, path) that they are sending? 
| It comes from REST architectural style, a guideline: Representational State - Not rules or standard (long time)
| RESTful API: Google has GRVC & Facebook has GraphQL
| Everything is a resource: POST - resources are normally nouns, users, save this, want to do this, make this
| Each resource is accessible via a unique URI/URL: Uniform Resource Identifier/Locator - addy where the resouce lives on the internet localhost:5000/lessons
| Resources can have multiple representations - JSON or XML
| Communication happens over a stateless protocol (HTTP)
| Resource management happnes via HTTP methods
| The noun doesn't have to be plural but that's the industry standard. Pick one and be consistent!
| PATCH is a partial update

| Non REST API/URL:  v.  REST API/URL:       ||   Actions with Express using HTTP Method - CRUD
| /listAllLessons        /api/lessons             GET - Read
| /createLesson          /api/lessons             POST - Create (body)
| /deleteLesson          /api/lessons/{id}        DELETE - Delete (dynamic id)
| /updateUser            /api/users/{id}          PATCH/PUT (whole obj) - Update - (dynamic id)

| HATEOAS (Hypermedia As The Engine Of Application State): It makes RESTful API fully RESTful like Github API. API sends you data and links to the next, previous, and last page as part of the response you get. 

## Menu

- CommonJS modules (require/export) in Express: = to import/export in React
- Express Router (break up a server into sub-component): Sub-APIs, similar to React Routers. You don't put all of your react code in one component. Similar with Express.

- Different ways to read data from the client: 4 different ways the client can send data to the server (POST)
  - body ---> req.body
  - query string ---> req.query
  - URL parameter ---> req.params
  - 
- using sub-routes

## Requirements 

| List all hubs
| Add a hub
| Update a hub
| Remove a hub
| View hub messages inside of hub 
| Post a message to a hub

## Data Access - DB

- use `db.js` to talk to the database - Methods in there
  - find() 
  - findById(id)
  - insert(post) // magically inserts to the db - provided by the library
  - update(id, posts)
  - remove(id)
  - findPostComments(postId)
  - findCommentById(id)
  - insertComment(comment)

| Same as using axios to make http calls & the methods that I can use are GET, POST, PUT, etc. 
| Separation of concern - things related to db save it somewhere else
| Handle it as a promise .then 
| Sanitation: No need to worry about sql injection - it's taken care of by the library
| Validation: Is the info valid? Is there a name? Is the price a number? Is it a positive number? At least has to be a number and positive value. At lease 0 and up. We need to do it. 

**Everyone of those methods returns a promise**

axios
 .then (call promise and then a response)


## Basic Application Architecture (at least 3)

- UI layer/code: UI for an API is the router - When you connect to an API, you get JSON back and you send JSON. Router === UI v. React: Showing with onClick - UI
- Business Logic layer/code: Unique for every app
- Database layer/code: Most apps need to save/persist data 

## Using Query String Parameters

https://www.google.com/search?q=mdn+query+string+parameters&oq=mdn+query+string+parameters

Domain
https://www.google.com

Path Endpoint
/search

?           -----> marks the beginning of the query string

Who is making sure of assembling this URL? Client. We have to construct this query string

source=hp   -----> key/value pair

&           -----> separates key/value pair

q = mdn+query+string+parameters

&

oq = mdn+query+string+parameters

Express will parse the query string into an object

```js
req.query = { // API developer only cares about this
  source: hp,
  q: mdn + query + string + parameters,
};
```

You can only send info to the body by doing a POST or Update

db: should happen on the server - it's the job of the server
client_age -------> clientAge
