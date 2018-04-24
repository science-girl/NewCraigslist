/** TODO remove this hardcoded value and get the actual value from the UI **/
var CITY = "Vancouver";
/**
 * This function queries holochain for posts matching the given name and city
 * @param name of the category link that was clicked
 * @param city is the current city
 **/
function getCategoryData(name, city) {
  var data = JSON.stringify({
    category: name,
    city: city
  });

  var responseFunction = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      localStorage.setItem("postsData", xhr.responseText);
      localStorage.setItem("isCategory", true);
    }
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/fn/readAndWritePosts/readPostsByCityAndCategory", true);
  xhr.setRequestHeader("Content-type", "application/json");

  xhr.onreadystatechange = responseFunction;

  xhr.send(data);
}
document.getElementsByClassName("category")[0].onclick = function onClick(
  event
) {
  getCategoryData(document.getElementsByClassName("category")[0].name, CITY);
};

document.getElementsByClassName("category")[1].onclick = function onClick(
  event
) {
  getCategoryData(document.getElementsByClassName("category")[1].name, CITY);
};

document.getElementsByClassName("category")[2].onclick = function onClick(
  event
) {
  getCategoryData(document.getElementsByClassName("category")[2].name, CITY);
};

document.getElementsByClassName("category")[3].onclick = function onClick(
  event
) {
  getCategoryData(document.getElementsByClassName("category")[3].name, CITY);
};
