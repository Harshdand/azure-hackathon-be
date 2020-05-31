const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { getUserQuery } = require('../queries/person');

router.post('/', async (req, res) => {
  const db = getDb();
  const personContainer = db.container('person');
  const assetContainer = db.container('asset');
  const { id, assetType, assetId, amount, heirs } = req.body;
  const assetPayload = {
    type: assetType,
    assetId,
    amount,
    userId: id,
    heirs: heirs.map((heir) => {
      return {
        ...heir,
        pan: heir.pan.toUpperCase(),
      };
    }),
  };

  const { resource: asset } = await assetContainer.items.create({
    ...assetPayload,
  });

  if (asset) {
    const querySpec = {
      query: getUserQuery(id),
    };

    const { resources: user } = await personContainer.items
      .query(querySpec)
      .fetchAll();

    if (user && user[0]) {
      const assets = user[0].assets || [];

      const { resource: updatedUser } = await personContainer
        .item(user[0].id)
        .replace({ ...user[0], assets: [...assets, asset.id] });

      if (updatedUser) {
        res.send({ success: true });
      } else {
        res
          .status(500)
          .send({ success: false, message: 'Unable to save asset details' });
      }
    } else {
      res
        .status(500)
        .send({ success: false, message: 'Unable to save asset details' });
    }
  } else {
    res
      .status(500)
      .send({ success: false, message: 'Unable to save asset details' });
  }
});

router.get('/', (req, res) => {
  res.send('asset');
});

module.exports = router;
