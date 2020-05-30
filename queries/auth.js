const loginQuery = (email, category) => {
  return `SELECT c.id, c.firstName, c.middleName, c.lastName, c.phone, c.email, c.address, c.password from c WHERE c.email="${email}" AND c.category="${category}"`;
};

module.exports = { loginQuery };
