const defaultHeaders = {
  Connection: "keep-alive",
  Accept: "application/json, text/plain, /",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Ontel Mac OS X 11_2_3) AppleWebKit/537/36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36",
  "Content-Type": "application/json",
  "Accept-Language": "en, zh-TW;q=0.8,en-US;q=0.7",
};

const endPoints = {
  getPostForPubKey: "get-posts-for-public-key",
  getProfiles: "get-profiles",
};

module.exports = {
  defaultHeaders,
  endPoints,
  genUrl: (endpoint) => `https://api.bitclout.com/${endpoint}`,
};
