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
// Because it contains "this" that is globally referenced.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  
  // COMMENTED: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // This is a ternary operation, checking if the publisedOn variable is true then show the days ago, else it's false and just the hard-coded string of (draft).
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEWED: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEWED: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENTED: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// We're calling this function from the fetchAll() function, but rawData is only returned if it exists in local storage. In our previous lab we had the rawData sort and forEach in separate functions, the loadAll combines them into one function.
Article.loadAll = rawData => {
  rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))
  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}
// localStorage.clear();

// REVIEWED: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEWED: What is this 'if' statement checking for? Where was the rawData set to local storage?
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
  } else {
    $.getJSON("data/hackerIpsum.json") 
    .done(function(data) {
      $.each(data, function(key, val) {
        $('#articles').append(new Article(val).toHtml()); 
      });
      Article.loadAll(data);
      localStorage.setItem("rawData", JSON.stringify(data));
    });
  }
  // needed to re-order the scripts to get articleView to not throw an error
  articleView.initIndexPage();      
}

Article.fetchAll();