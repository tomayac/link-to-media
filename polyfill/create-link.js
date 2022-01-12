// Escapes `"` and `\` in attribute values.
function escapeAttributeValue(selector) {
  return selector.replace(/["\\]/g, '\\$&');
}

function createSelector(element) {
  // `<foo id>`
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }
  const tag = element.tagName.toLowerCase();
  // `<foo src>`
  if (element.src) {
    return `${tag}[src="${escapeAttributeValue(element.src)}"]`;
  }
  const childWithSrcAttribute = element.querySelector('[src]');
  // `<foo><bar src /></foo>`
  if (childWithSrcAttribute) {
    return `${tag}:has([src="${escapeAttributeValue(
      childWithSrcAttribute.src,
    )}"])`;
  }
  throw new Error('Unsupported element');
}

function isUnique(selector) {
  return document.querySelectorAll(selector).length === 1;
}

function createLink(element) {
  const selector = createSelector(element);
  if (isUnique(selector)) {
    // @ToDo: Only proceed if the selector is unique. Otherwise, find a new
    // selector.
    console.log('Selector is unique', selector);
  }
  return new URL(
    `#:~:selector(type=CssSelector,value=${selector})`,
    location.href,
  ).toString();
}
