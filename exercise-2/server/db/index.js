/* eslint-disable no-console */

const chalk = require('chalk');
const { MongoClient } = require('mongodb');

class DatabaseClient {
  constructor() {
    this.instance = null;
  }

  async connect() {
    await MongoClient.connect(process.env.MONGODB_URI)
      .then((client) => {
        console.log('%s Connected to MongoDB.', chalk.green('✓'));
        this.instance = client.db(process.env.MONGODB_DBNAME);
      })
      .catch((err) => {
        console.log('%s MongoDB connection error. %s', chalk.red('✗'), err);
      });
  }

  getCollection(collectionName) {
    return this.instance.collection(collectionName);
  }
}

module.exports = new DatabaseClient();
