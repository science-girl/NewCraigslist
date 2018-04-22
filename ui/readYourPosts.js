document.getElementById("seeYourPostButton").onclick = function onClick(event) {
  event.preventDefault();
  console.log("button clicked");
  var xhr = new XMLHttpRequest();
  var url = "/fn/readAndWritePosts/readYourPosts";
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      alert(xhr.responseText);
    }
  };
};
