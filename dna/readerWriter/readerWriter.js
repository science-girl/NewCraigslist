function genesis() {
  commit("city", "Vancouver");
  return true;
}
// this is called whenever a write/commmit
// call is made
function validateCommit(entry) {
  switch (entry) {
    case "cityLinks":
      return true;
    case "holoText":
      return true;
    case "city":
      return true;
    default:
      return false;
  }
}

function validateLink(stuff) {
  return true;
}

function validateLinkPkg(stuff) {
  return null;
}

function validatePut(stuff) {
  return true;
}

function holoTextWrite(text) {
  // returns a hash of the text param
  // this hash how to access the text from
  // the chain
  var hash = commit("holoText", text);
  var me = App.Agent.Hash;
  commit("cityLinks", {
    Links: [
      { Base: me, Link: hash, Tag: "postsByUser" },
      {
        Base: makeHash("city", "Vancouver"),
        Link: hash,
        Tag: "postsByCity"
      }
    ]
  });
  return hash;
}

function holoTextRead(hash) {
  // get returns entry corresponding to the hash
  // or a HashNotFound message
  return get(hash, { Local: true });
}
