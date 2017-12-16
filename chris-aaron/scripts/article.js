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
// This function has a contextual 'this' reference so the arrow function cannot be used.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENTED: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // This line is assigning a value to the 'publishedOn' property through the use of a ternary operator, represented by the question mark and colon. It executes the same logic as an 'if-else' statement.

  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEWED: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEWED: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENTED: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This function is called in the 'Article.fetchAll()' method at the bottom of this page. 'rawData' no longer represents an array of objects in a local .js file. It now represents article data that must be accessed and requested remotely as opposed to locally.

Article.loadAll = rawData => {
  rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEWED: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // COMMENTED: What is this 'if' statement checking for? Where was the rawData set to local storage?
  // If 'rawData' exists in local storage, then run the Article.loadAll() method. If it doesn't, then retrieve the 'rawData' using an $.ajax() request, post into local storage, then run Article.loadAll(). Initially, rawData was not set to local storage. This functionality had to be implemented in the 'else' statement.

  if (localStorage.rawData) {

    $.getJSON('../data/hackerIpsum.json').done(function(rawData, message, xhr) {
      let eTagNew = xhr.getResponseHeader('ETag');
      console.log('Original ETag: ', localStorage['ETag']);
      console.log('New ETag', eTagNew);
      if (localStorage['ETag'] !== eTagNew) {
        console.log('ETags do not match!')
        localStorage.removeItem('rawData');
        localStorage.setItem('rawData', JSON.stringify(rawData));
        Article.loadAll(JSON.parse(JSON.stringify(rawData)));
        articleView.initIndexPage();
      }
      else {
        console.log('ETags match!');
        Article.loadAll(JSON.parse(JSON.stringify(rawData)));
        articleView.initIndexPage();
      }
    });

    //Article.loadAll();

  }
  else {
    // TODONE
    // COMMENTED: The code below (1) retrieve the rawData from the .json file via proper pathway, (2) convert rawData object to string, (3) set rawData to local storage with key variable 'newStorageData', (4) pulled local storage string and parsed it, (5) run Article.loadAll(), (6) and run articleView.initIndexPage(). If execution fails, run alert.

    $.getJSON('../data/hackerIpsum.json').done(function(rawData, message, xhr) {
      let eTagOrig = xhr.getResponseHeader('ETag');
      let data = JSON.stringify(rawData);

      localStorage.setItem('rawData', data);
      localStorage.setItem('ETag', eTagOrig);
      console.log('ETag Original: ', eTagOrig);

      Article.loadAll(JSON.parse(data));
      articleView.initIndexPage();
    }).fail(function() {
      alert('Could not retrieve rawData!');
    }).always(function() {
      // create refresh button functionality?
    });

  }
}