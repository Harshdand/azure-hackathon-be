const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.send('Account');
});

router.get('/', (req, res) => {
  res.send('Account');
});

module.exports = router;
