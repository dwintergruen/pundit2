# Pundit 2 repo

#### Install
    npm install


#### Develop
    grunt dev
    
Examples are built in examples/*html from examples/src/*html. Create a new one
inside there including header and footer comments for grunt to build them correctly.
Or copy one of the existing into a new one, directly. The list of examples is 
built automatically.


#### Build
    grunt build

Will build a production ready pundit2 distribution in /build/:

* fonts/*
* css/*ver*.pundit.css
* scripts/*ver*.libs.js
* scripts/*ver*.pundit2.js

Plus all of the examples using the production code: index.html or just *.html.

Plus the documentation in /Docs.