
const express = require('express');
const router = express.Router();
// Use body-parser middleware to parse JSON requests
router.use(express.urlencoded({ extended: true }));

function isAuthenticated(req, res, next) {
  //console.log(req.session);
  //tired of logging in....
  next(); //comment this 

  // uncomment below
  // if (req.session.authenticated) {
  //   console.log("is authenticated");
  //   next();
  // } else {
  //   console.log("not authenticated, redirecting....");
  //   res.redirect('/login');
  // }
}

// Middleware for handling POST requests
router.post ('/posts', (req, res) => {
  const { title, content } = req.body;

  // Insert the new post into the database
  const sql = 'INSERT INTO posts (title, content) VALUES (?, ?)';
  db.query(sql, [title, content], (err, result) => {
    if (err) {
      console.error('Error inserting post: ' + err.message);
      res.status(500).send('Error inserting post');
      return;
    }
    res.status(201).json({ message: 'Post created successfully' });
  });
});

// Middleware for handling UPDATE requests
router.put('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  const { title, content } = req.body;

  // Update the post in the database
  const sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
  db.query(sql, [title, content, postId], (err, result) => {
    if (err) {
      console.error('Error updating post: ' + err.message);
      res.status(500).send('Error updating post');
      return;
    }
    res.json({ message: 'Post updated successfully' });
  });
});

// Middleware for handling DELETE requests
router.delete('/posts/:postId', (req, res) => {
  const postId = req.params.postId;

  // Delete the post from the database
  const sql = 'DELETE FROM posts WHERE id = ?';
  db.query(sql, [postId], (err, result) => {
    if (err) {
      console.error('Error deleting post: ' + err.message);
      res.status(500).send('Error deleting post');
      return;
    }
    res.json({ message: 'Post deleted successfully' });
  });
});

module.exports= {
  isAuthenticated
}