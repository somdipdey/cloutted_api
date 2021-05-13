const getHashTags = (inputString) => {
  let regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
  let matches = [];
  let match;

  while ((match = regex.exec(inputString))) {
    matches.push(match[1].toLowerCase());
  }

  return matches;
};
