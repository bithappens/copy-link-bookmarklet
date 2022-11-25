if (navigator.clipboard && window.isSecureContext) {
  navigator.clipboard.writeText("${clipboard}");
} else {
  textArea = document.createElement("textarea");
  textArea.value = "${clipboard}";
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    successful = document.execCommand("copy");
  } catch (e) {
    alert("Error: Copy title failed on this page. " + e);
  }
  textArea.remove();
}
