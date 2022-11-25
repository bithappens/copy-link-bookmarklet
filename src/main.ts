window.onload = function () {
  // Check for browser access to clipboard
  if (typeof window.ClipboardItem === "undefined") {
    // Disable the button
    (<HTMLButtonElement>document.getElementById("button_rich")!).disabled =
      true;
    // Show explanation text
    document.getElementById("func_warning")!.style.display = "block";
    // Disable the checkbox
    (<HTMLButtonElement>document.getElementById("check_rich")!).disabled = true;
    document.getElementById("check_rich")!.parentElement!.style.textDecoration =
      "line-through";
  }

  // Connect the providing of import file and download
  const checkboxes = <Array<HTMLInputElement>>(
    Array.from(document.getElementsByClassName("bml_check"))
  );
  // OnLoad of the page
  CheckboxUpdate(checkboxes);
  // On changing any checkbox
  checkboxes.forEach((c) =>
    c.addEventListener("change", (_) => {
      CheckboxUpdate(checkboxes);
    })
  );
};

function CheckboxUpdate(checkboxes: HTMLInputElement[]) {
  const flags = checkboxes.map((c) => c.checked);

  // Nothing checked => disabled
  if (flags.some((b) => b === true)) {
    (<HTMLButtonElement>document.getElementById("import_button")!).disabled =
      false;
  } else {
    (<HTMLButtonElement>document.getElementById("import_button")!).disabled =
      true;
  }

  RefreshImportFile(flags);
}

function RefreshImportFile(flags: boolean[]): void {
  const file = BuildImportFile(flags);
  const link = <HTMLAnchorElement>document.getElementById("import_a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
}

function BuildImportFile(flags: boolean[]): File {
  const now = Math.floor(Date.now() / 1000);
  const favicon = (<HTMLImageElement>document.getElementById("favicon32")!).src;
  const favlinks = <Array<HTMLAnchorElement>>(
    Array.from(
      (<HTMLAnchorElement>document.getElementById("bml_buttons"))!.children
    )
  );

  // TODO: Only include the ones that are checked
  return new File(
    [
      "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
      "<!--This is an automatically generated file.",
      "    It will be read and overwritten.",
      "    Do Not Edit! -->",
      "<TITLE>Bookmarks</TITLE>",
      "<H1>Copy Link Bookmarklets</H1>",
      "<DL>",
    ]
      .concat(
        favlinks
          .filter((_, i) => flags[i])
          .map(
            (a, i) =>
              "<DT><A " +
              `HREF="${a.href}" ` +
              `ADD_DATE="${now}" ` +
              `LAST_VISIT="${now}" ` +
              `ICON="${favicon}" ` +
              `LAST_MODIFIED="${now}" ` +
              'ICON_URI="https://bithappens.github.io/copy-link-bookmarklet/icon/favicon-32x32.png">' +
              `${a.innerText}</A></DT>`
          )
      )
      .concat(["</DL>"])
      .map((e) => e + "\n"),
    "CopyLinkBookmarklet.html",
    {
      type: "text/html",
    }
  );
}
