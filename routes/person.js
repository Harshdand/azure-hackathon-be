const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

router.post('/', (req, res) => {
  res.send('Person');
});

router.get('/', async (req, res) => {
  const db = getDb();
  const container = db.container('person');

  const querySpec = {
    query: 'SELECT * from c',
  };

  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  res.send(items);
});

module.exports = router;
