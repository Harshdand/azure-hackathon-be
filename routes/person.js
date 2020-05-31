const express = require('express');
// const { v4: uuid } = require('uuid');
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const router = express.Router();
const { getDb } = require('../db');
const { personResponseFields } = require('../constants/person');
const {
  searchPersonQuery,
  getUserQuery,
  getAssetsQuery,
} = require('../queries/person');
const { sendNewUserEmail, triggerClaimEmails } = require('../utils/email');

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

    try {
      await sendNewUserEmail({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        password,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    resp.success = false;
    resp.message = 'Unable to add user';
  }

  res.send(resp);
});

router.get('/', async (req, res) => {
  const db = getDb();
  const container = db.container('person');
  const { aadhaar, pan, id } = req.query;

  const querySpec = {
    query: searchPersonQuery(aadhaar, pan, id),
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
  const assetContainer = db.container('asset');
  const { id, dod } = req.body;

  const querySpec = {
    query: getUserQuery(id),
  };

  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  if (items && items[0]) {
    const { firstName, lastName } = items[0];

    const { resource } = await container
      .item(items[0].id)
      .replace({ ...items[0], isAlive: false, deathDetails: { dod } });

    const { assets = [] } = items[0];

    console.log(getAssetsQuery(id));
    if (assets.length) {
      const getAssetsQuerySpec = {
        query: getAssetsQuery(id),
      };

      const { resources: assetItems } = await assetContainer.items
        .query(getAssetsQuerySpec)
        .fetchAll();

      console.log(assetItems);

      if (assetItems && assetItems.length) {
        const messages = [];

        assetItems.forEach((asset) => {
          const { heirs = [], type, assetId } = asset;

          heirs.forEach((heir) => {
            messages.push({
              heir,
              type,
              assetId,
              user: { firstName, lastName },
            });
          });
        });

        const emailResp = await triggerClaimEmails(messages);
        console.log(emailResp);
        res.send({ success: true });
      }
    } else {
      res.send({ success: true });
    }
  } else {
    res
      .status(500)
      .send({ success: false, message: 'Unable to confirm death' });
  }
});

module.exports = router;
