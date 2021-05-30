const getHashTags = (inputString) => {
  // const regex = /#\S+/g;

  const regex =
    /#(\w+|(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+)/g;

  const matchTexts = inputString.match(regex);

  if (!matchTexts) return null;

  const matches = matchTexts.map((match) => {
    const hashtag = match.trim().toLowerCase();
    return hashtag.substring(1, hashtag.length);
  });

  return matches;
};

module.exports = getHashTags;

//console.log(getHashTags("I love #stackoverflow because #people are very #helpful! #😀😀 😀 #Here"));
