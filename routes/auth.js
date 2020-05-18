const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { getDb } = require('../db');

router.post('/login', async (req, res) => {
  const db = getDb();
  const container = db.container('person');
  const { email, password: pswd, category } = req.body;

  const querySpec = {
    query: `SELECT * from c WHERE c.email="${email}" AND c.category="${category}"`,
  };

  const { resources = [] } = await container.items.query(querySpec).fetchAll();
  const user = resources[0];

  if (user) {
    const match = await bcrypt.compare(pswd, user.password);
    const { password, aadhaar, pan, category, ...rest } = user;

    if (match) {
      const { email, category, id } = user;
      const accessToken = jwt.sign(
        { email, category, id },
        process.env.JWT_TOKEN
      );
      res.set('token', accessToken).send(rest);
    } else {
      res.status(401).send({ success: false, message: 'Auth failed' });
    }
  } else {
    res.status(401).send({ success: false, message: 'Auth failed' });
  }
});

router.post('/login/help', async (req, res) => {
  const { password } = req.body;
  const salt = await bcrypt.genSalt();
  const pswd = await bcrypt.hash(password, salt);

  res.send({ pswd });
});

module.exports = router;
