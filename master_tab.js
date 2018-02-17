/* USAGE: Injects collapsed tabs into HTML list in master tab
 * AUTHORS: Jonathan Lee, James Zhang
 * Date: 02/17/18 */

 document.addEventListener('DOMContentLoaded', function() {
    document.title = master_title;
    var tab_ls = document.createElement('ol');
    for (var i = 0; i < master_ls.length; i++) {
        var item = document.createElement('li');
        item.appendChild(document.createTextNode(master_ls[i]));
        list.appendChild(item);
    }
    document.getElementById('tabs').appendChild(tab_ls);
 }, false);