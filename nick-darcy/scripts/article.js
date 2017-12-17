'use strict';

function Article(rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}
// REVIEWED: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENTED: Why isn't this method written as an arrow function?
// RESPONSE: Arrow functions cannot be used with .this
Article.prototype.toHtml = function () {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);

  // COMMENTED: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // RESPONSE:  This is a js ternary operator.. a ternary operator is an operator that takes three arguments. The arguments and result can be of different types. Many programming languages that use C-like syntax feature a ternary operator, ?: , which defines a conditional expression.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEWED: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEWED: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENTED: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// RESPONSE:  This function is called in the Article.fetchAll function. The rawData is now being called remotely with JSON.
Article.loadAll = rawData => {
  rawData.sort((a, b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEWED: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {

  // REVIEWED: What is this 'if' statement checking for? Where was the rawData set to local storage?
  // RESPONSE: This 'if' statement is checking to see if rawData is already in local storage.  If not, it is calling it remotely using JSON.

  // COMMENTED:  Sequence of code execution was determined for the following: 1) we wanted to check to see if rawData was in local storage, if it IS, then parse it and run the dataReady function. 2) if it's NOT in local storage, load JSON which retreives it then runs the dataReady function.
  if (localStorage.rawData) {
    let rawData = JSON.parse(localStorage.rawData);
    dataReady(rawData);
  } else {
    loadJSON();
  }

  function dataReady(rawData) {
    console.log('its ready!');
    Article.loadAll(rawData);
    articleView.initIndexPage();
    rawData = JSON.stringify(rawData);
    localStorage.setItem('rawData', rawData);
  }
  
  function loadJSON() {
    $.getJSON('data/hackerIpsum.json')
      .then(function (rawData) {
        dataReady(rawData);
      }),
    function (err) {
      console.error(err);
    }
  }
}