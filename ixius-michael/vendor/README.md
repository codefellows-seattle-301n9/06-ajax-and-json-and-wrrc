# 06-ajax-and-json-and-wrrc

**Author**: Ixius Procopios & Michael Brown
**Version**: 1.0.0 (increment the patch/fix version number up if you make more commits past your first submission)
## Overview
The application generates listings of blog articles using a combination of JavaScript/JQuery/JSON. It also allows the user to create articles and preview them as there being created.
## Getting Started
<!-- What are the steps that a user must take in The order to build this app on their own machine and get it running? -->
The user would be creating an if/else statement in article.js that checks if the article data is in local storage.
1. If the information is in localStorage then the user would need to perform the loadAll function on data.
2. They would then perform a forEach() on the localStorage data and appends the articles.
3. If the data isn't currently in the localStorage then the user would need to get the data into local Storage, the way we did it was by using an AJAX function.
4. They can then load and append the data to the function
## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. 
Languages
    JavaScript
    HTML
    CSS
Libraries
    Jquery 
    IconMoon
    Normalized.css
    handelBars
Data structure 
JSON -->
## Change Log
<!-- Use this are to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:
01-01-2001 4:59pm - Application now has a fully-functional express server, with GET and POST routes for the book resource.
12-16-2017 10:55 - Application now loads from JSON file and Local Storage
## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. 
 normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css
https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.11/handlebars.min.js |  MIT License |
https://github.com/wycats/handlebars.js/blob/master/LICENSE
https://icomoon.io/faq.html
Thanks to the codeFellow TAs and our classmates 
-->
-->