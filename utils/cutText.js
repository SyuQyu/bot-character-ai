async function cutText(prefix, text) {
  const dotIndex = text.indexOf(prefix);
  const cutText = text.substring(0, dotIndex);
  return cutText;
}

module.exports = { cutText };
