const express = require('express');
// const { v4: uuid } = require('uuid');
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const router = express.Router();
const { getDb } = require('../db');
const { personResponseFields } = require('../constants/person');
const { searchPersonQuery, getUserQuery } = require('../queries/person');

router.post('/', async (req, res) => {
  const db = getDb();
  const container = db.container('person');

  const password = generator.generate({
    length: 12,
    numbers: true,
  });

  const salt = await bcrypt.genSalt();
  const pswd = await bcrypt.hash(password, salt);

  const { resource: item } = await container.items.create({
    ...req.body,
    isAlive: true,
    password: pswd,
    category: 'user',
  });

  console.log(password);

  const resp = {};
  if (item) {
    const data = {};
    personResponseFields.forEach((field) => {
      data[field] = item[field];
    });
    resp.success = true;
    resp.data = data;
  } else {
    resp.success = false;
    resp.message = 'Unable to add user';
  }

  res.send(resp);
});

router.get('/', async (req, res) => {
  const db = getDb();
  const container = db.container('person');
  const { aadhaar, pan } = req.query;

  const querySpec = {
    query: searchPersonQuery(aadhaar, pan),
  };

  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  const resp = {};
  if (items && items[0]) {
    resp.success = true;
    resp.data = items[0];
    res.send(resp);
  } else {
    resp.success = false;
    resp.message = 'Unable to find the user';
    res.status(404).send(resp);
  }
});

router.post('/death', async (req, res) => {
  const db = getDb();
  const container = db.container('person');
  const { id, dod } = req.body;

  const querySpec = {
    query: getUserQuery(id),
  };

  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  if (items && items[0]) {
    const { resource } = await container
      .item(items[0].id)
      .replace({ ...items[0], isAlive: false, deathDetails: { dod } });

    res.send({ success: true });
  } else {
    res
      .status(500)
      .send({ success: false, message: 'Unable to confirm death' });
  }
});

module.exports = router;
