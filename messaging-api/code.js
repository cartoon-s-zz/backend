'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
// const firebase = require("firebase");

process.env.DEBUG = 'dialogflow:debug';

// initialize firebase
const admin = require("firebase-admin");
admin.initializeApp(
  {
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://calculate-bmi-line-heekcq.firebaseio.com'
  });

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  let body = JSON.stringify(request.body);
  var obj = JSON.parse(body);
  let userId = obj.originalDetectIntentRequest.payload.data.source.userId;
  console.log('userId', userId);
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function bodyMassIndex(agent) {
    let weight = request.body.queryResult.parameters.weight;
    let height = request.body.queryResult.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);
    let result = 'Wrong Information';
    if (bmi < 18.5) {
      result = 'You are too thin. come on ! time to work out';
    } else if (bmi < 23) {
      result = 'Nice job bro ! You have a nice shape';
    } else if (bmi < 25) {
      result = 'A little fat. Time to exercise';
    } else if (bmi < 30) {
      result = 'You need to work out!';
    } else {
      result = 'You have to work out now! You can do it bro';
    }
    agent.add(result);
    return admin.database().ref('/BMI').child(userId).push({ BMI: bmi, Result: result }).then((snapshot) => {
      console.log('successful save');
    });
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Cal-BMI - custom - yes', bodyMassIndex);
  agent.handleRequest(intentMap);
});