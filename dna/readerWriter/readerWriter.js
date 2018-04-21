function genesis() {
  return true;
}

// this is called whenever a write/commmit
// call is made
function validateCommit(text) {
  console.log(text);
  return true;
}

function holoTextWrite(text) {
  // returns a hash of the text param
  // this hash how to access the text from
  // the chain
  return commit("holoText", text);
}

function holoTextRead(hash) {
  // get returns entry corresponding to the hash
  // or a HashNotFound message
  return get(hash, { Local: true });
}
