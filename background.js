chrome.browserAction.onClicked.addListener(function() {
    /* Store all tab URLs in current window */
    var urlList = new Array();
    var map = {};

    chrome.tabs.query({currentWindow: true}, function(tabs) {

        for(var i = 0; i < tabs.length; i++){
            if (tabs[i] != null){
                urlList.push(new URL(tabs[i].url));
            }
        }

        /*Key is domain name. Holds array of url values. */
        for (var i = 0; i < urlList.length; i++){
            var key = urlList[i].hostname
            if (!(key in map))
                map[key] = new Array();
            map[key].push(urlList[i].href);
        }

        /*DEBUG: Check that all domains and URLs were saved:*/
        var keys = Object.keys(map);
        for (var i=0; i < keys.length; i++){
            window.console.log("Top-level domain: ", keys[i]);
            var urls = map[keys[i]];
            for (var j = 0; j < urls.length; j++) {
                window.console.log(urls[j]);
            }
        }

    });
});