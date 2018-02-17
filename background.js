/* USAGE: Activates when clicking extension icon.
 * AUTHORS: James Zhang, Jonathan Lee
 * Date: 02/17/18 */

var url_ls = new Array();
var tab_dict = {}; // {key: unique tab id, val: complete tab href}
var map = {}; // {key: hostname, val: array of associated tab hrefs}
var current_tab = -100;
var domain_name = "";
var tabs_removed = new Array();

chrome.browserAction.onClicked.addListener(function() {
    /* Store all tab URLs in current window */
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        /* Get all tabs in current window and store into */
        for (var i = 0; i < tabs.length; i++){
            if (tabs[i] != null){
                var tab_url = new URL(tabs[i].url);
                url_ls.push(tab_url);
                tab_dict[tabs[i].id] = tab_url.href;
                if (tabs[i].highlighted == 1)
                    current_tab = tabs[i].id;
            }
        }

        /* Fill map with K-V pairs. Keys are domain names.
         * Values are arrays of URLs. */
        for (var i = 0; i < url_ls.length; i++){
            var key = url_ls[i].hostname
            if (!(key in map))
                map[key] = new Array();
            map[key].push(url_ls[i].href);
        }

        var keys = Object.keys(map);

        /* Create master tabs, delete originals */
        for (var i = 0; i < keys.length; i++){
            window.console.log("Top-level domain: ", keys[i]);
            var urls = map[keys[i]];
            if (urls.length > 1){
                for (var j = 0; j < urls.length; j++) {
                    url = remove_tab(tab_dict, urls[j], current_tab);
                    if (url != -1000)
                        tabs_removed.push(url);
                }
                /* Need to dynamically add flavicon, title, and list. */
                domain_name = keys[i];
                chrome.tabs.create({url:"master_tab.html"});

            }
        }

    });
});

/* Note: + is equivalent to parseInt. */
function remove_tab(obj, value, current_tab) {
    var key = Object.keys(obj)[Object.values(obj).indexOf(value)];
    var k = parseInt(key, 10);
    if (k != current_tab) {
        delete obj[key];
        chrome.tabs.remove(+key);
        return value;
    }
    return -1000;
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