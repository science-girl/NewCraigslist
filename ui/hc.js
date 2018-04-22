document.getElementById("createPostForm").onsubmit = function onSubmit(event) {
  event.preventDefault();
  var title = document.getElementById("titlePostInput").value;
  var details = document.getElementById("detailPostInput").value;
  var category = document.getElementById("categoryPostInput");
  category = category.options[category.selectedIndex].text;
  var email = document.getElementById("emailInput").value;

  var xhr = new XMLHttpRequest();
  var url = "/fn/readAndWritePosts/writePost";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  var data = JSON.stringify({
    title: title,
    details: details,
    category: category,
    email: email,
    city: "Vancouver",
    timestamp: Date.now()
  });
  xhr.send(data);

  title = "";
  details = "";
  category = "";
  email = "";
  window.history.back();
};
