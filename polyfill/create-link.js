function createSelector(element) {
  // `<foo id>`
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }
  const tag = element.tagName.toLowerCase();
  // `<foo src>`
  if (element.src) {
    return `${tag}[src="${element.src.replace(/["\\]/g, '\\$&')}"]`;
  }
  const childWithSrcAttribute = element.querySelector('[src]');
  // `<foo><bar src /></foo>`
  if (childWithSrcAttribute) {
    // @ToDo: Need to fix this and understand how `:has` works
    // (https://www.smashingmagazine.com/2021/06/has-native-css-parent-selector/).
    return `${tag}:has([src=${childWithSrcAttribute.src.replace(/["\\]/g, '\\$&')}])`;
  }
  throw new Error('unsupported element');
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
