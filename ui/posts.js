window.onload = function() {
  var posts = JSON.parse(localStorage.getItem("postsData"));
  var isCategory = JSON.parse(localStorage.getItem("isCategory"));

  console.log(posts);
  for (i = 0; i < posts.length; i++) {
    appendPost(
      posts[i].category,
      posts[i].timestamp,
      posts[i].title,
      posts[i].city,
      posts[i].details,
      isCategory
    );
  }
};

function appendPost(category, date, title, location, details, isCategory) {
  // create post div
  var container = document.getElementById("post-container");
  var postDiv = document.createElement("div");
  postDiv.setAttribute("id", "post");
  postDiv.setAttribute("class", "post");
  container.appendChild(postDiv);

  var postTitle = document.createElement("p");
  postTitle.innerHTML = `<strong>${getMonthOfYear(
    new Date(date).getMonth()
  )} ${new Date(
    date
  ).getDate()}</strong> <strong>[${category}]</strong> ${title} (${location}) `;
  postTitle.setAttribute("class", "title");

  var postText = document.createElement("p");
  postText.innerHTML = `${details}`;
  postText.setAttribute("class", "text-muted"); //"details");

  postDiv.appendChild(postTitle);
  if (!isCategory) {
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-link");
    deleteButton.innerHTML = "Delete";
    var editButton = document.createElement("button");
    editButton.setAttribute("class", "btn btn-link");
    editButton.innerHTML = "Edit";
    postDiv.appendChild(deleteButton);
    postDiv.appendChild(editButton);
  }

  postDiv.appendChild(postText);
}
// Helper function to get month name of the year
//@param: target date
const getMonthOfYear = month => {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
  }
};
