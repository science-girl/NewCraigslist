/**
 * @param key is the tag the link is associated with
 * @param link is the plaintext name whose existence we are verifying
 * If the link does not exist in the HC then it is created
 **/
function linkCheck(key, link) {
  var hashedKeyAndLink = makeHash(key, link);
  if (get(hashedKeyAndLink) === null) {
    debug(link + " does not exist");
    try {
      commit(key, link);
    } catch (exception) {
      debug(exception);
    }
  }
  if (get(hashedKeyAndLink) !== null) {
    debug("created " + link);
  }
}

/**
 * Whenever the app is restarted, the chain is re-generated.
 * The genesis function gets called each time this happens.
 * This function is a good place to put any set-up logic if req'd
 **/
function genesis() {
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
    case "category":
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

function validateDel(entry_type, hash, pkg, sources) {
  return get(hash) !== null;
}

/**
 * creates a post linked to:
 * - agent hash
 * - city provided in the data
 * - category provided in the data
 * - city and category provided in the data
 **/
function writePost(data) {
  var hash;
  try {
    hash = commit("postData", data);
  } catch (exception) {
    debug("Error writing " + data + exception);
    return null;
  }

  var me = App.Agent.Hash;
  var cityAndCat = makeHash("cityAndCat", data["city"] + data["category"]);

  // Check and create any links that may not yet exist
  linkCheck("cityAndCat", data["city"] + data["category"]);
  linkCheck("city", data["city"]);
  linkCheck("category", data["category"]);
  try {
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
  } catch (exception) {
    debug("Error committing links " + exception);
    return null;
  }

  debug(hash);

  return hash;
}

/**
 * @param hash is hashedLink we are retrieving (ie. target value)
 * @param tag is the tag given when the link was created (ie. the relationship btwn link and base)
 * @returns an array of entries matching the hash given
 **/
function retrieveLinks(hash, tag) {
  // if link doesn't exist then return empty
  if (get(hash) === null) return [];

  try {
    var allLinks = getLinks(hash, tag, {
      Load: true
    });
  } catch (exception) {
    debug("Unable to retrieve links " + exception);
  }
  debug("Number of links: " + allLinks.length);
  return allLinks.map(function(link) {
    //debug(JSON.stringify(link));
    return link.Entry;
  });
}

/**
 * @returns all the posts of the current user
 **/
function readYourPosts() {
  return retrieveLinks(App.Agent.Hash, "postsByUser");
}

/**
 * @param city name
 * @returns all the posts for the given city
 **/
function readPostsByCity(city) {
  return retrieveLinks(makeHash("city", city), "postsByCity");
}

/**
 * @param category name
 * @returns all the posts for the given category
 **/
function readPostsByCategory(category) {
  return retrieveLinks(makeHash("category", category), "postsByCategory");
}

/**
 * @param data is a JSON object: {"city":<name_of_city>, "category": <name_of_category}
 * @returns all the posts for the given city and category
 **/
function readPostsByCityAndCategory(data) {
  var hashedCat = makeHash("cityAndCat", data.city + data.category);
  return retrieveLinks(hashedCat, "cityAndCat");
}

/**
 * @param postHash is the hash of the post to delete
 * @returns true if the deletion was successful and false otherwise
 * removes a post iff belongs to the current user
 **/
function deletePost(postHash) {
  var deleteMsg = postHash + " deleted by " + App.Agent.Hash;
  try {
    debug("delete hash " + remove(postHash, deleteMsg));
  } catch (exception) {
    debug(postHash + " not deleted: " + exception);
    return false;
  }
  return true;
}

function readPost(hash) {
  // get returns entry corresponding to the hash
  // or a HashNotFound message
  return get(hash, { Local: true });
}
