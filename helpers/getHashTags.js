const getHashTags = (inputString) => {
  const regex = /(?:#)(([a-zA-Z\d]+) | \u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]+)/gm;
  let matches = [];
  let match;

  while ((match = regex.exec(inputString))) {
    matches.push(match[1].toLowerCase());
  }

  return matches;
};
