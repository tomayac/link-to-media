function createSelector(element) {
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }
  if (element.src) {
    const tag = element.tagName.toLowerCase();
    return `${tag}[src="${element.src.replace(/["\\]/g, '\\$&')}"]`;
  }
  throw new Error('unsupported element');
}

function createLink(element) {
  const selector = createSelector(element);
  return new URL(
    `#:~:selector(type=CssSelector,value=${selector})`,
    location.href,
  ).toString();
}
