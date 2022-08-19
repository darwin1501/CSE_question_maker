const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the records.
recordRoutes.route("/questions").get(function (req, res) {
    let db_connect = dbo.getDb("cse_trainer_db");
    db_connect
      .collection("questions")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
  });

// This section will help you create a new record.
recordRoutes.route("/question/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    choices: req.body.choices,
    correctAnswer: req.body.correctAnswer,
    explanation: req.body.explanation,
    questionType: req.body.questionType,
    question: req.body.question,
    dateModified: req.body.dateModified
  };
  db_connect.collection("questions").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you get a single record by id
recordRoutes.route("/question/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("questions")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you get a single record by question
recordRoutes.route("/question/find/:question").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { question: req.params.question};
  db_connect
      .collection("questions")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you get questions related to search field vaue
recordRoutes.route("/questions/search/:question").get(function (req, res) {
  let db_connect = dbo.getDb();

    const myQuery = [
    {
      $search: {
        index: 'question',
        phrase: {
          query: req.params.question,
          path: "question"
        }
      }
    }
  ]

  db_connect
  .collection("questions")
  .aggregate(myQuery).toArray(function(err, result) {
    if (err) throw err;
    res.json(result);
  });;
});

// This section will help you update a record by id.
recordRoutes.route("/question/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      choices: req.body.choices,
      correctAnswer: req.body.correctAnswer,
      explanation: req.body.explanation,
      questionType: req.body.questionType,
      question: req.body.question,
      dateModified: req.body.dateModified
    },
  };
  db_connect
    .collection("questions")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a record
recordRoutes.route("/question/delete/:id").delete((req, res)=>{
  let db_connect = dbo.getDb()
  let myQuery = { _id: ObjectId(req.params.id) }

  db_connect
      .collection("questions")
      .deleteOne(myQuery, (err, obj)=>{
          if(err) throw err
          console.log("1 document deleted")
          res.json(obj)
      })
})

  module.exports = recordRoutes