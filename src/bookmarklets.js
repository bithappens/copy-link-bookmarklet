/*jshint esversion: 9 */

const fs = require('fs');
const bookmarkleter = require('bookmarkleter');
const tidyurl = fs.readFileSync('node_modules/tidy-url/lib/tidyurl.min.js', 'utf8');


class Bookmarklet {
    constructor(format, link, button) {
        this.format = format;
        this.link = link;
        this.button = button;
    }
}

function simple(format) {
    const cmd = format.replace("${url}", "'+window.location.href+'").replace("${title}", "'+document.title+'");
    const clean = "navigator.clipboard.writeText('" + cmd + "')";
    return bookmarkleter(tidyurl + clean, { minify: true, iife: true });
}

exports.bookmarklets = [
    new Bookmarklet("Rich Text", "#", "Copy Rich Link"),
    new Bookmarklet("Markdown", simple("[${title}](${url})"), "Copy Markdown Link"),
    new Bookmarklet("Html", simple('<a href="${url}">${title}</a>'), "Copy Html Link"),
    new Bookmarklet("Wikitext", simple("[${url} ${title}])"), "Copy Wikitext Link"),
    new Bookmarklet("reST", simple("`${title} <${url}>`_"), "Copy reST Link"),
    new Bookmarklet("BBCode", simple("[url=${url}]${title}[/url]"), "Copy BBCode Link")
];
