document.getElementById("seeYourPostButton").onclick = function onClick(event) {
  var xhr = new XMLHttpRequest();
  var url = "/fn/readAndWritePosts/readYourPosts";
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      console.log(xhr.responseText);
      localStorage.setItem("postsData", xhr.responseText);
      localStorage.setItem("isCategory", false);
    }
  };
};
