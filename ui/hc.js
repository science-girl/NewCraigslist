function yourApp() {
  alert("your UI code here!");
}

document.getElementById("createPostForm").onsubmit = function onSubmit(event) {
  var title = document.getElementById("titlePostInput").value;
  var details = document.getElementById("detailPostInput").value;
  var category = document.getElementById("categoryPostInput");
  category = category.options[category.selectedIndex].text;
  var email = document.getElementById("emailInput").value;
};
