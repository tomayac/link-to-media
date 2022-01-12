// Escapes `"` and `\` in attribute values.
function escapeAttributeValue(selector) {
  return selector.replace(/["\\]/g, '\\$&');
}

function createSelector(element) {
  // Case: `<foo id>`
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }
  const tag = element.tagName.toLowerCase();
  // We want the `src` as marked up, not the resolved URL.
  const src = element.getAttribute('src');
  // Case: `<foo src>`
  if (src) {
    return `${tag}[src="${escapeAttributeValue(src)}"]`;
  }
  const childWithSrcAttribute = element.querySelector('[src]');
  // Case: `<foo><bar src /></foo>`
  if (childWithSrcAttribute) {
    return `${tag}:has([src="${escapeAttributeValue(
      // We want the `src` as marked up, not the resolved URL.
      childWithSrcAttribute.getAttribute('src'),
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
