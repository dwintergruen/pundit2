# Pundit 2

## Install

To install the project and be ready to develop you need a few components:
* npm (nodejs >0.9)
* grunt-cli

##### On ubuntu 12.04 (and maybe others) you might need to add a repository for a recent version of nodejs
>     sudo apt-get update
>     sudo apt-get install -y python-software-properties python g++ make
>     sudo add-apt-repository -y ppa:chris-lea/node.js
>     sudo apt-get update
>     sudo apt-get install nodejs

#### Install npm, grunt
>     sudo apt-get install npm
>     sudo npm -g install grunt-cli grunt

#### Install openpal
WARNING: this step must NOT be run as root, npm will just let you down.

>     npm install

This will install the full toolchain to develop, build and deploy the application.


## Develop
>     grunt dev
    
Examples are built in examples/*html from examples/src/*html. 

To create a new one: add a new .html in examples/src/, include the header and footer comments
for grunt to build them correctly. Or copy one of the existing into a new one, directly. 

The list of examples is built and included everywhere automatically.


## Build
>     grunt build

Will build a production ready pundit2 distribution in /build/:

* fonts/*
* css/*ver*.pundit.css
* scripts/*ver*.libs.js
* scripts/*ver*.pundit2.js

Plus all of the examples using the production code: index.html or just *.html.

Plus the documentation in /Docs.