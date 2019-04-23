var openChat;
document.addEventListener("DOMContentLoaded", function() {
  openChat = function() {
    var chatEl = document.getElementById("launcher");
    var iframeDoc = chatEl.contentWindow.document.body.getElementsByTagName("button")[0];
    iframeDoc.click();
  }
});
