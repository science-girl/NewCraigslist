// CONSTANTS
var CITY_LINKS = "cityLinks";
var CITY = "city";
var POST_DATA = "postData";
var CATEGORY = "category";
var CITY_AND_CATEGORY = "cityAndCat";
var POSTS_BY_USER = "postsByUser";
var POSTS_BY_CITY = "postsByCity";
var POSTS_BY_CATEGORY = "postsByCategory";

/**
 * @param key is the tag the link is associated with
 * @param link is the plaintext name whose existence we are verifying
 * If the link does not exist in the HC then it is created
 **/
function linkCheck(key, link) {
  var hashedKeyAndLink = makeHash(key, link);

  /**
   * This block takes care of the case where duplicate entry has been deleted
   * and is then re-linked. get returns an error that the link has been deleted
   * This may be sort of an edge case, although I could see how someone might
   * add, remove, then re-add the same post (uniqueness is determined by link values, not timestamp)
   **/
  try {
    get(hashedKeyAndLink);
  } catch (e) {
    debug(e);
    commit(key, link);
  }

  if (get(hashedKeyAndLink) === null) {
    debug(link + " does not exist");
    try {
      commit(key, link);
      debug("Created " + link);
    } catch (exception) {
      debug(exception);
    }
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
    case CITY_LINKS:
      return true;
    case POST_DATA:
      return true;
    case CITY:
      return true;
    case CATEGORY:
      return true;
    case CITY_AND_CATEGORY:
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

function validateMod(entry_type, entry, header, replaces, pkg, sources) {
  return true;
}

/**
 * @param data is the post as a JSON object
 * @returns hash of the data from the commit
 * creates a post linked to:
 * - agent hash
 * - city provided in the data
 * - category provided in the data
 * - city and category provided in the data
 **/
function writePost(data) {
  var hash;
  try {
    hash = commit(POST_DATA, data);
  } catch (exception) {
    debug("Error writing " + data + exception);
    return null;
  }

  var me = App.Agent.Hash;
  var cityAndCat = makeHash(CITY_AND_CATEGORY, data[CITY] + data[CATEGORY]);

  // Check and create any links that may not yet exist
  linkCheck(CITY_AND_CATEGORY, data[CITY] + data[CATEGORY]);
  linkCheck(CITY, data[CITY]);
  linkCheck(CATEGORY, data[CATEGORY]);

  try {
    commit(CITY_LINKS, {
      Links: [
        { Base: me, Link: hash, Tag: POSTS_BY_USER },
        {
          Base: makeHash(CITY, data[CITY]),
          Link: hash,
          Tag: POSTS_BY_CITY
        },
        {
          Base: makeHash(CATEGORY, data[CATEGORY]),
          Link: hash,
          Tag: POSTS_BY_CATEGORY
        },
        {
          Base: cityAndCat,
          Link: hash,
          Tag: CITY_AND_CATEGORY
        }
      ]
    });
  } catch (exception) {
    debug("Error committing links " + exception);
    return null;
  }
  //debug(hash);
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
  //debug("Number of links: " + allLinks.length);
  return allLinks.map(function(link) {
    //debug(JSON.stringify(link));
    return link.Entry;
  });
}

/**
 * @returns all the posts of the current user
 **/
function readYourPosts() {
  return retrieveLinks(App.Agent.Hash, POSTS_BY_USER);
}

/**
 * @param city name
 * @returns all the posts for the given city
 **/
function readPostsByCity(city) {
  return retrieveLinks(makeHash(CITY, city), POSTS_BY_CITY);
}

/**
 * @param category name
 * @returns all the posts for the given category
 **/
function readPostsByCategory(category) {
  return retrieveLinks(makeHash(CATEGORY, category), POSTS_BY_CATEGORY);
}

/**
 * @param data is a JSON object: {"city":<name_of_city>, "category": <name_of_category}
 * @returns all the posts for the given city and category
 **/
function readPostsByCityAndCategory(data) {
  var hashedCat = makeHash(CITY_AND_CATEGORY, data.city + data.category);
  return retrieveLinks(hashedCat, CITY_AND_CATEGORY);
}

/**
 * @param data is a JSON object {"post":{<new data>}, "oldHash": "<previous_hash>"}
 * @returns hash of the updated post
 **/
function editPost(data) {
  var hash;
  try {
    hash = update(POST_DATA, data.post, data.oldHash);
  } catch (exception) {
    debug("Update not made: " + exception);
    return data.oldHash;
  }

  return hash;
}

/**
 * @param postHash is the hash of the post to delete
 * @returns true if the deletion was successful and false otherwise
 **/
function removePost(postHash) {
  if (deleteLinks(postHash)) {
    return deletePost(postHash);
  }
  return false;
}

/**
 * @param postHash is the hash of the post to delete
 * @returns true if the deletion was successful and false otherwise
 **/
function deletePost(postHash) {
  var deleteMsg = postHash + " deleted by " + App.Agent.Hash;
  try {
    remove(postHash, deleteMsg);
  } catch (exception) {
    //debug(postHash + " not deleted: " + exception);
    return false;
  }
  return true;
}

/**
 * @param postHash is the hash of the post to delete
 * @returns true if the links were deleted and false otherwise
 **/
function deleteLinks(postHash) {
  var me = App.Agent.Hash;
  var data = get(postHash);

  if (data == null) return false;

  var cityAndCat = makeHash(CITY_AND_CATEGORY, data[CITY] + data[CATEGORY]);
  try {
    commit(CITY_LINKS, {
      Links: [
        {
          Base: me,
          Link: postHash,
          Tag: POSTS_BY_USER,
          LinkAction: HC.LinkAction.Del
        },
        {
          Base: makeHash(CITY, data[CITY]),
          Link: postHash,
          Tag: POSTS_BY_CITY,
          LinkAction: HC.LinkAction.Del
        },
        {
          Base: makeHash(CATEGORY, data[CATEGORY]),
          Link: postHash,
          Tag: POSTS_BY_CATEGORY,
          LinkAction: HC.LinkAction.Del
        },
        {
          Base: cityAndCat,
          Link: postHash,
          Tag: CITY_AND_CATEGORY,
          LinkAction: HC.LinkAction.Del
        }
      ]
    });
  } catch (exception) {
    debug("Links not deleted: " + exception);
    return false;
  }
  return true;
}

function readPost(hash) {
  // get returns entry corresponding to the hash
  // or a HashNotFound message
  return get(hash, { Local: true });
}
