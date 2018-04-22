function genesis() {
  commit("city", "Vancouver");
  commit("city", "Kelowna");
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

/**
 * creates a post linked to:
 * - agent hash
 * - city provided in the data
 * - category provided in the data
 **/
function writePost(data) {
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
        Link: makeHash("category", data["category"]),
        Tag: "postsByCityToCategory"
      },
      {
        Base: makeHash("category", data["category"]),
        Link: hash,
        Tag: "postsByCategory"
      }
    ]
  });
  return hash;
}

function readYourPosts() {
  var agentHash = App.Agent.Hash;
  debug(agentHash);
  var allLinksForAgent = getLinks(agentHash, "postsByUser", {
    Load: true
  });
  debug("Number of links: " + allLinksForAgent.length);
  return allLinksForAgent.map(function(link) {
    debug(JSON.stringify(link));
    return link.Entry;
  });
}

function readPostsByCity(city) {
  var hashedCity = makeHash("city", city);
  var linksForCity = getLinks(hashedCity, "postsByCity", { Load: true });

  debug("Number of links: " + linksForCity.length);
  return linksForCity.map(function(link) {
    debug(JSON.stringify(link));
    return link.Entry;
  });
}

function readPostsByCityAndCategory(city, category) {}

function readPost(hash) {
  // get returns entry corresponding to the hash
  // or a HashNotFound message
  return get(hash, { Local: true });
}
