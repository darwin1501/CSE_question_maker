
const { MongoClient } = require("mongodb");
const dbURI = process.env.ATLAS_URI;
const client = new MongoClient(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var databaseConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        databaseConnection = db.db("cse_trainer_db");
        console.log("Successfully connected to MongoDB."); 
      }
      return callback(err);
         });
  },

  getDb: function () {
    return databaseConnection;
  },
};
