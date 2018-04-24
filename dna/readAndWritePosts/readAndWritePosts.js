/**
 * Populates holochain each time instance restarts
 * This is for dev only and not for production use
 **/
function populateHC() {
  writePost({
    title: "Paint my fence?",
    category: "Jobs",
    subcategory: "customer service",
    city: "Vancouver",
    details:
      "My fence is in need of a new coat of paint and primer. Will pay handsomely.",
    email: "earnest@gmail.com",
    timestamp: Date.now()
  });
  writePost({
    title: "Spectaular backrubs, seeking",
    category: "Jobs",
    subcategory: "admin",
    city: "Vancouver",
    details: "In need of a great backrub",
    email: "soreBack@gmail.com",
    timestamp: Date.now()
  });
  writePost({
    title: "Paint my fence",
    category: "Personals",
    subcategory: "missed connections",
    city: "Vancouver",
    details: "please?",
    email: "paint@gmail.com",
    timestamp: Date.now()
  });

  writePost({
    title: "Miniature Home",
    category: "Housing",
    subcategory: "apartments",
    city: "Vancouver",
    details: "surprisingly spacious",
    email: "mini@gmail.com",
    timestamp: Date.now()
  });
  writePost({
    title: "Fridge",
    category: "ForSale",
    subcategory: "appliances",
    city: "Vancouver",
    details: "like new",
    email: "mini@gmail.com",
    timestamp: Date.now()
  });
}

/**
 * @param key is the tag the link is associated with
 * @param link is the plaintext name whose existence we are verifying
 * If the link does not exist in the HC then it is created
 **/
function linkCheck(key, link) {
  var hashedKeyAndLink = makeHash(key, link);
  if (get(hashedKeyAndLink) === null) {
    console.log(link + " DNE");
    try {
      commit(key, link);
    } catch (exception) {
      debug(exception);
    }
  }
  if (get(hashedKeyAndLink) !== null) {
    console.log("created " + link);
  }
}
function genesis() {
  /** Uncomment to populate w/test data for UI
   populateHC(); **/
  return true;
}

/**
 * Called whenever a write/commmit call is made
 **/
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

function validateLinkPkg(entryType) {
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

  // Check and create any links that may not yet exist
  linkCheck("cityAndCat", data["city"] + data["category"]);
  linkCheck("city", data["city"]);
  linkCheck("category", data["category"]);

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
  debug(category);
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
  if (get(hashedCat) === null) {
    console.log("hash dne");
    return [];
  }
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
