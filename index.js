// implement your API here
const express = require('express');
const db = require('./data/db.js');


const server = express();
server.get('/', (req, res) => {
    res.send("My node!");
})
const port = 8000;
server.listen(port, () => console.log("\n=== API server on 8000 ===\n"));

server.use(express.json());


// POST   | /api/users     | Creates a user using the information sent inside the `request body`

server.post('/api/users', (req, res) => {
    console.log(req.body);
    const { name, bio } = req.body;
      db.insert({ name, bio })
        .then(({ id }) => {
          db.findById(id)
            .then(user => {
              res.json(user);
            })
            .catch(err => {
              console.log(err);
              res.json({error: "error geting users data"});
            });
        })
        .catch(err => {
          console.log(err);
          res.json({error: "error geting users data"});
        });
  });

//   | GET    | /api/users     | Returns an array of all the user objects contained in the database.  

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => 
        res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.json({error: "error geting users data"});
    });
});


// | GET    | /api/users/:id | Returns the user object with the specified `id`.  

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
      console.log(err);
      res.json({error: "error geting users data"});
    });
});

// | GET    | /api/users/:id | Returns the user object with the specified `id`.  

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
        res.status(200).json(deleted)
    })
    .catch(err => {
      console.log(err);
      res.json({error: "Can't delete user id"});
    });
});

// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. 

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  db.update(id, { name, bio })
    .then(updated => {
      db.findById(id)
          .then(user => res.status(200).json(user))
          .catch(err => {
            console.log(err);
            res.json({error: "error geting users data" });
          });
  
    })
    .catch(err => {
      console.log(err);
      res.json({error: "Can't update users data"});
    });
});


