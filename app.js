const path = require('path');
const express = require('express');
const indexRouter = require('./routes/index');

const app = express();

// Part A needs this: an HTML <form> sends its fields URL-encoded (name=Mari&email=...).
app.use(express.urlencoded({ extended: false }));

// Part B needs this: fetch() sends a JSON body ({"name":"Mari","email":"..."}).
app.use(express.json());

// Serve the HTML/CSS/JS pages in /public (index.html is the home page).
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
