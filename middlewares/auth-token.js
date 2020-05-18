const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ success: false, message: 'Auth failed' });
  }

  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send({ success: false, message: 'Auth failed' });
    }

    req.user = user;
    next();
  });
};

module.exports = authToken;
