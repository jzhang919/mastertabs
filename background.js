/*USAGE: Activates when clicking extension icon.
* AUTHORS: James Zhang, Jonathan Lee
* Date: 02/17/18
* */

chrome.browserAction.onClicked.addListener(function() {
    /* Store all tab URLs in current window */
    var urlList = new Array();
    var tab_dict = {};
    var map = {};
    var current_tab = -100;

    chrome.tabs.query({currentWindow: true}, function(tabs) {

        for(var i = 0; i < tabs.length; i++){
            if (tabs[i] != null){
                urlList.push(new URL(tabs[i].url));
                tab_dict[tabs[i].id] = new URL(tabs[i].url).href;
                if(tabs[i].highlighted == 1)
                    current_tab = tabs[i].id;
            }
        }

        /* Fill map with K-V pairs. Keys are domain names.
        * Values are arrays of URLs. */
        for (var i = 0; i < urlList.length; i++){
            var key = urlList[i].hostname
            if (!(key in map))
                map[key] = new Array();
            map[key].push(urlList[i].href);
        }

        var keys = Object.keys(map);

        /*Create master tabs, delete originals
        * Note: + is equivalent to parseInt. */
        for (var i=0; i < keys.length; i++){
            window.console.log("Top-level domain: ", keys[i]);
            var urls = map[keys[i]];
            if (urls.length > 1){
                for (var j = 0; j < urls.length; j++) {
                    remove_tab(tab_dict, urls[j], current_tab);
                }
                chrome.tabs.create({url:"master_tab.html"});
            }
        }


    });
});

function remove_tab(obj, value, current_tab) {
    var key = Object.keys(obj)[Object.values(obj).indexOf(value)];
    if (key != current_tab.id) {
        delete obj[key];
        chrome.tabs.remove(+key);
    }
}

/* Debugging Tools
* DEBUG: Print all URL values stored in tab dictionary.
Object.keys(tab_dict).forEach(function(tab){
   window.console.log(tab_dict[tab]);
});
*
* DEBUG: Check that all domains and URLs were saved in map:
for (var i=0; i < keys.length; i++){
    window.console.log("Top-level domain: ", keys[i]);
    var urls = map[keys[i]];
    for (var j = 0; j < urls.length; j++) {
        window.console.log(urls[j]);
    }
}
*
*
*
* */