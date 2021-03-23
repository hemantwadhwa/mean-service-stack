/* global db: true, print: true */
/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint no-restricted-globals: ["off", "print"] */
db = db.getSiblingDB('ankom-dev');

db.getCollectionNames().forEach((colName) => {
  const count = db[colName].count({});

  if (count) {
    print(colName);
    db[colName].deleteMany({});
  }
});
