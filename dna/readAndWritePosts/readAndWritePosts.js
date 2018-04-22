function genesis() {
  commit("city", "Vancouver");
  return true;
}
// this is called whenever a write/commmit
// call is made
function validateCommit(entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "cityLinks":
      return true;
    case "postData":
      return true;
    case "city":
      return true;
    default:
      return false;
  }
}

function validateLink(links) {
  return true;
}

function validateLinkPkg(links) {
  return null;
}

function validatePut(data) {
  return true;
}

function writePost(data) {
  // returns a hash of the text param
  // this hash how to access the text from
  // the chain
  var hash = commit("postData", data);
  var me = App.Agent.Hash;
  commit("cityLinks", {
    Links: [
      { Base: me, Link: hash, Tag: "postsByUser" },
      {
        Base: makeHash("city", data["city"]),
        Link: hash,
        Tag: "postsByCity"
      },
      {
        Base: makeHash("city", data["city"]),
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
