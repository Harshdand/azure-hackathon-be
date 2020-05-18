const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.send('Fd');
});

router.get('/', (req, res) => {
  res.send('Fd');
});

module.exports = router;
