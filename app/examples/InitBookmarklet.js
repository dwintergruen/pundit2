(function() {
    
    var p = 'http://localhost/pundit2/build',
        h = document.getElementsByTagName('head')[0],
        d = document.createElement('script'),
        l = document.createElement('link');

    console.log('Initializing the bookmarklet from path '+p);

    l.rel = 'stylesheet';
    l.href = p+'/css/pundit-bm.css';
    l.type = 'text/css';
    l.media = 'screen';
    l.charset = 'utf-8';
    h.appendChild(l);

    // Important: without var !!
    somePunditConfig = {};

    d.type = 'text/javascript';
    d.src = p+'/scripts/bookmarklet.js';
    h.appendChild(d);

    console.log('Bookmarklet loading done, have fun!');

})();