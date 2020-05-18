const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.send('Heir');
});

router.get('/', (req, res) => {
  res.send('Heir');
});

module.exports = router;
