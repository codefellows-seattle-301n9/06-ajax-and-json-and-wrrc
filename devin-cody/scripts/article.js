'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENTED: Why isn't this method written as an arrow function?
// because the general rule of thumb of this.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENTED: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  //it is basically an if else statement if this.publishedStatus = publishedOn then write string published $... else it will write out draft
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENTED: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?

//This function is called in the fetchAll function. rawaData is not a JSON data file vs a JS file with an array of objects.
Article.loadAll = rawData => {
  rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  rawData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  if (localStorage.rawData) {
    //TODONE
    let getData = localStorage.getItem('rawData');
    let blogData = JSON.parse(getData);
    Article.loadAll(blogData);
    articleView.initIndexPage();
    var jqXHR = $.ajax({
      type: 'HEAD',
      url: '../data/hackerIpsum.json',
      dataType: 'json',
      complete: function(XMLHttpRequest, textStatus){
        var eTag = XMLHttpRequest.getResponseHeader('ETag');
        if(localStorage['ETag'] !== eTag) {
          showArticles();
        }
        console.log('respone etag=', eTag, ' LS etag=', localStorage['ETag']);
        Article.loadAll(blogData);
        articleView.initIndexPage();
      }
    });
  } else showArticles();
  
  function showArticles() {
    //TODONE
    var rawData = $.getJSON('../data/hackerIpsum.json').then(
      function(rawData, message, xhr) {
        let eTag = xhr.getResponseHeader('ETag');
        console.log(eTag);
        Article.loadAll(rawData);
        articleView.initIndexPage();
        localStorage.setItem('rawData',JSON.stringify(rawData));
        localStorage.setItem('ETag', eTag);
        
        console.log('setting local storage');
      },
      // COMMENT: we determined the sequence for this section by a lot of trial and error. we knew the load.all had to run first to populate the article array and then the forEach method could come in and append the array to the DOM.
      function(err){
        console.error(err);
      }
    )
  }
}
Article.fetchAll();
