const functions = require('firebase-functions');
const express = require('express');
const { createRequestHandler } = require('@remix-run/express');

const app = express();

app.use(express.static('public'));

app.all(
  '*',
  createRequestHandler({
    getLoadContext() {
      // Whatever you return here will be passed as `context` to your loaders.
    },
  })
);

exports.app = functions.https.onRequest(app)