/**
 * generic send function
 **/
function send(method, url, data, fnOnDone) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-type", "application/json");

  if (fnOnDone) xhr.onreadystatechange = fnOnDone;

  xhr.send(data);
}
/**
 * @param method is POST or GET or PUT
 * @param action is the name of the function in DNA readAndWritePosts.js
 * @param data is the data passed to the action function
 * @param fnOnDone is a function to execute on the response
 **/
function readAndWriteSend(method, action, data, fnOnDone) {
  send(method, "/fn/readAndWritePosts/" + action, data, fnOnDone);
}
