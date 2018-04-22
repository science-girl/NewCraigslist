/**
 * Populates holochain each time instance restarts
 * This is for dev only and not for production use
 **/
function populateHC() {
  writePost({
    title: "Paint my fence?",
    category: "Jobs",
    city: "Kelowna",
    details:
      "My fence is in need of a new coat of paint and primer. Will pay handsomely.",
    email: "earnest@gmail.com",
    timestamp: 12345
  });
  writePost({
    title: "Spectaular backrubs, seeking",
    category: "Jobs",
    city: "Vancouver",
    details: "In need of a great backrub",
    email: "soreBack@gmail.com",
    timestamp: 12345
  });
}

function genesis() {
  populateHC();
  commit("city", "Vancouver");
  commit("city", "Kelowna");
  commit("cityAndCat", "KelownaJobs");
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
    case "cityAndCat":
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
  var cityAndCat = makeHash("cityAndCat", data["city"] + data["category"]);

  // if cityAndCat does not yet exist, create it:
  if (cityAndCat == null) commit("cityAndCat", cityAndCat);

  commit("cityLinks", {
    Links: [
      { Base: me, Link: hash, Tag: "postsByUser" },
      {
        Base: makeHash("city", data["city"]),
        Link: hash,
        Tag: "postsByCity"
      },
      {
        Base: makeHash("category", data["category"]),
        Link: hash,
        Tag: "postsByCategory"
      },
      {
        Base: cityAndCat,
        Link: hash,
        Tag: "cityAndCat"
      }
    ]
  });
  return hash;
}

function readYourPosts() {
  var agentHash = App.Agent.Hash;
  var allLinksForAgent = getLinks(agentHash, "postsByUser", {
    Load: true
  });
  debug("Number of links: " + allLinksForAgent.length);
  return allLinksForAgent.map(function(link) {
    //debug(JSON.stringify(link));
    return link.Entry;
  });
}

function readPostsByCity(city) {
  var hashedCity = makeHash("city", city);
  var linksForCity = getLinks(hashedCity, "postsByCity", { Load: true });

  debug("Number of links: " + linksForCity.length);
  return linksForCity.map(function(link) {
    //debug(JSON.stringify(link));
    return link.Entry;
  });
}

function readPostsByCategory(category) {
  var hashedCat = makeHash("category", category);
  var linksForCat = getLinks(hashedCat, "postsByCategory", { Load: true });

  debug("Number of links: " + linksForCat.length);
  return linksForCat.map(function(link) {
    //debug(JSON.stringify(link));
    return link.Entry;
  });
}

function readPostsByCityAndCategory(params) {
  var hashedCat = makeHash("cityAndCat", params.city + params.category);
  var linksForCat = getLinks(hashedCat, "cityAndCat", { Load: true });

  debug("Number of links: " + linksForCat.length);
  return linksForCat.map(function(link) {
    //debug(JSON.stringify(link));
    return link.Entry;
  });
}

function readPost(hash) {
  // get returns entry corresponding to the hash
  // or a HashNotFound message
  return get(hash, { Local: true });
}
