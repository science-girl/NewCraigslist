function appendPost(date, title, location) {
  // create post div
  var container = document.getElementById("post-container");
  var postDiv = document.createElement("div");
  postDiv.setAttribute("id", "post");
  container.appendChild(postDiv);

  var postTitle = document.createElement("p");
  postTitle.innerHTML = `<strong>${date}</strong> ${title} (${location})`;

  var deleteButton = document.createElement("button");
  deleteButton.value = "Delete";
  var editButton = document.createElement("button");
  deleteButton.value = "Edit";

  var postText = document.createElement("p");
  postText.innerHTML = `${details}`;

  postDiv.appendChild(postTitle);
  postDiv.appendChild(deleteButton);
  postDiv.appendChild(editButton);
  postDiv.appendChild(postText);
}
