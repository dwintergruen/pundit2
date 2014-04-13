(function() {
    
    var p = 'http://localhost/pundit2/build/bm',
        h = document.getElementsByTagName('head')[0],
        d = document.createElement('script'),
        l = document.createElement('link');

    // console.log('Initializing the bookmarklet from path '+p);

    l.rel = 'stylesheet';
    l.href = p+'/css/pundit-bm.css';
    l.type = 'text/css';
    l.media = 'screen';
    l.charset = 'utf-8';
    h.appendChild(l);

    // Important: without var !!
    punditConfig = {};

    d.type = 'text/javascript';
    d.src = p+'/scripts/pundit-bm.js';
    h.appendChild(d);

    var b = document.getElementsByTagName('body')[0],
        div = document.createElement('div'),
        am = document.createElement('annomatic-panel');
        
    // TODO: remove this hack to show the annomatic panel (in a fixed
    // position even) as soon as there's something else to show!
    am.setAttribute('class', 'fixed');
    div.setAttribute('data-ng-app', "Pundit2");
    div.appendChild(am);
    b.appendChild(div);

    // console.log('Bookmarklet loading done, have fun!');

})();