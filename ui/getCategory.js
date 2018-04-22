document.getElementsByClassName("category")[0].onclick = function onClick(
  event
) {
  //event.preventDefault();
  console.log("button clicked");
  var xhr = new XMLHttpRequest();
  var url = "/fn/readAndWritePosts/readYourPosts";
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json");

  alert(document.getElementsByClassName("category")[0].name);

  // var data = JSON.stringify({
  //   title: title,
  //   details: details,
  //   category: category,
  //   email: email,
  //   city: "Vancouver",
  //   timestamp: Date.now()
  // });
  // xhr.send(data);
  //
  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState == XMLHttpRequest.DONE) {
  //     alert(xhr.responseText);
  //   }
  // };
};
