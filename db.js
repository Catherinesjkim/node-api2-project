const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
  removeComment,
  findPostComments,
  findCommentById,
  insertComment,
};

function find() {
  return db('posts');
}

function findById(id) {
  return db('posts').where({ id: Number(id) })
  .first(); // added code
}

function insert(post) {
  return db('posts')
    .insert(post, 'id')
    .then(ids => ({ id: ids[0] }));
}

function update(id, post) {
  return db('posts')
    .where('id', Number(id))
    .update(post);
}

function remove(id) {
  return db('posts')
    .where('id', Number(id))
    .del();
}

function removeComment(id) {
  return db("comments")
    .where("id", Number(id))
    .del();
}

function findPostComments(postId) { // GET for a specific comment 
  return db('comments')
    .join('posts', 'posts.id', 'post_id')
    .select('comments.*', 'title as post')
    .where('post_id', postId)
    // .first(); // added code
}

function findCommentById(id) {
  return db('comments')
    .join('posts', 'posts.id', 'post_id')
    .select('comments.*', 'title as post')
    .where('comments.id', id);
}

function insertComment(comment) {
  return db('comments')
    .insert(comment)
    .then(ids => ({ id: ids[0] }));
}
