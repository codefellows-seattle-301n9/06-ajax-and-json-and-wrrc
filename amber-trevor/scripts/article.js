'use strict';

function Article (rawDataObj) {
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
// Because there is a 'this' which arrow functions don't support.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENTED: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // This is a ternary operator. It replaces writing out a full if/else statement.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEWED: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEWED: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENTED: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// Article.loadAll is being called in the Article.fetchAll function. These functions inside Article.loadAll were previously called each on their own rather than being wrapped in a class-level function.
Article.loadAll = rawData => {
  rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));

  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)));

}

// REVIEWED: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEWED: What is this 'if' statement checking for? Where was the rawData set to local storage?
  // the if statement is checking for local storage with a key of rawData
  if (localStorage.rawData) {
    let rawData = JSON.parse(localStorage.getItem('rawData'));
    Article.loadAll(rawData);
    articleView.initIndexPage();
  } else {
    $.getJSON('../data/hackerIpsum.json', function(json) {
      let retrievedJSON = json;
      Article.loadAll(retrievedJSON);
      articleView.initIndexPage();
      localStorage.setItem('rawData', JSON.stringify(retrievedJSON));
      //COMMENT: We used console logs to determine where the article data was going.  This allowed us to work through the necessary sequence.  We were able to get it to article.all which the articleView.initIndexPage needed in order to render it to the DOM.
    });
  }
}
