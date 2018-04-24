/**
 * Populates holochain each time instance restarts
 * This is for dev only and not for production use
 * If req'd for testing, call this function in the genesis function
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

module.exports = populateHC;
