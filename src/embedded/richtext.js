navigator.clipboard.write([
  new window.ClipboardItem({
    "text/html": new Blob(["<a href='${url}'>${title}</a>"], {
      type: "text/html",
    }),
    "text/plain": new Blob(["[${title}](${url})"], { type: "text/plain" }),
  }),
]);
