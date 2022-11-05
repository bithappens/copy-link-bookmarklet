// Checking compatibility

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
};
