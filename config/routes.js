const axios = require('axios');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtKey = require('../_secrets/keys').jwtKey;

const db = require("../database/dbConfig.js");
const { authenticate } = require('./middlewares');

const rounds = 14;

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const secret = jwtKey;
  const options = {
    expiresIn: "1h"
  };

  return jwt.sign(payload, secret, options);
}

function register(req, res) {
  // implement user registration
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, rounds);
  creds.password = hash;
  console.log(creds);

  db("users")
    .insert(creds)
    .then(ids => {
      console.log("Flag");
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

function login(req, res) {
  // implement user login
  const creds = req.body;

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: "Welcome", token });
      } else {
        res.status(401).json({ message: "Incorrect username or password" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function getJokes(req, res) {
  axios
    .get(
      // 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
      "https://safe-falls-22549.herokuapp.com/random_ten"
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
