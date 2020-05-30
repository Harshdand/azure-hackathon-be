const searchPersonQuery = (aadhaar, pan) => {
  const conditions = [];
  const query =
    'SELECT c.id, c.firstName, c.middleName, c.lastName, c.phone, c.email, c.aadhaar, c.pan, c.address, c.isAlive, c.deathDetails from c WHERE c.category="user" AND';

  if (aadhaar) {
    conditions.push(`c.aadhaar="${aadhaar}"`);
  }

  if (pan) {
    conditions.push(`c.pan="${pan}"`);
  }

  return `${query} ${conditions.join(' AND ')}`;
};

const getUserQuery = (id) => {
  return `SELECT * from c WHERE c.category="user" AND c.id="${id}"`;
};

module.exports = { searchPersonQuery, getUserQuery };
