/*jshint esversion: 9 */

const fs = require("fs");
const bookmarkleter = require("bookmarkleter");

const tidyurl = fs.readFileSync(
  "node_modules/tidy-url/lib/tidyurl.min.js",
  "utf8"
);

class Bookmarklet {
  constructor(id, format, link, button) {
    this.id = id;
    this.format = format;
    this.link = link;
    this.button = button;
  }
}

function replace_tokens(code) {
  return code
    .replaceAll("${url}", '"+tidyurl.clean(window.location.href).url+"')
    .replaceAll("${title}", '"+document.title+"');
}

function replace_clipboard(code, pattern) {
  return code.replaceAll("${clipboard}", pattern);
}

function simple(pattern) {
  const code = fs.readFileSync("src/embedded/simple.js", "utf8");
  const cmd = replace_tokens(replace_clipboard(code, pattern));
  return bookmarkleter(tidyurl + cmd, { minify: true, iife: true });
}

function richtext() {
  const code = fs.readFileSync("src/embedded/richtext.js", "utf8");
  const cmd = replace_tokens(code);
  return bookmarkleter(tidyurl + cmd, { minify: true, iife: true });
}

exports.bookmarklets = [
  new Bookmarklet("rich", "Rich Text", richtext(), "Copy Rich Link"),
  new Bookmarklet(
    "md",
    "Markdown",
    simple("[${title}](${url})"),
    "Copy Markdown Link"
  ),
  new Bookmarklet(
    "html",
    "Html",
    simple("<a href='${url}'>${title}</a>"),
    "Copy Html Link"
  ),
  new Bookmarklet(
    "wtext",
    "Wikitext",
    simple("[${url} ${title}])"),
    "Copy Wikitext Link"
  ),
  new Bookmarklet(
    "rest",
    "reST",
    simple("`${title} <${url}>`_"),
    "Copy reST Link"
  ),
  new Bookmarklet(
    "latex",
    "LaTeX",
    simple("\\\\href{${url}}{${title}}"),
    "Copy LaTeX Link"
  ),
  new Bookmarklet(
    "bbc",
    "BBCode",
    simple("[url=${url}]${title}[/url]"),
    "Copy BBCode Link"
  ),
];
