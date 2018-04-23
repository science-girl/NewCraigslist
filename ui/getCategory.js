function getCategoryData(name) {
  var xhr = new XMLHttpRequest();
  var url = "/fn/readAndWritePosts/readPostsByCityAndCategory";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  var category = name;

  var data = JSON.stringify({
    category: category,
    city: "Vancouver"
  });
  xhr.send(data);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      localStorage.setItem("postsData", xhr.responseText);
      localStorage.setItem("isCategory", true);
    }
  };
}
document.getElementsByClassName("category")[0].onclick = function onClick(
  event
) {
  getCategoryData(document.getElementsByClassName("category")[0].name);
};

document.getElementsByClassName("category")[1].onclick = function onClick(
  event
) {
  getCategoryData(document.getElementsByClassName("category")[1].name);
};

document.getElementsByClassName("category")[2].onclick = function onClick(
  event
) {
  getCategoryData(document.getElementsByClassName("category")[2].name);
};

document.getElementsByClassName("category")[3].onclick = function onClick(
  event
) {
  getCategoryData(document.getElementsByClassName("category")[3].name);
};
