let db;

const init = () => {
  const { COSMOS_URL, COSMOS_KEY, DATABASE_ID } = process.env;
  const CosmosClient = require('@azure/cosmos').CosmosClient;

  const client = new CosmosClient({
    endpoint: COSMOS_URL,
    key: COSMOS_KEY,
  });

  db = client.database(DATABASE_ID);
};

const getDb = () => {
  return db;
};

module.exports = { getDb, init };
