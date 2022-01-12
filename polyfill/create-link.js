const SUPPORTED_ELEMENTS = ['img', 'video', 'audio'];

// Escapes `"` and `\` in attribute values.
function escapeAttributeValue(selector) {
  return selector.replace(/["\\]/g, '\\$&');
}

function traverseElementHierarchy(element) {
  // On https://interactive-examples.mdn.mozilla.net/pages/tabbed/picture.html, the
  // context menu is triggered on `<shadow-output>`, a custom element. We need to
  // descend into the shadow root until we find any of `img`, `video`, or `audio`.
  if (
    !SUPPORTED_ELEMENTS.includes(element.tagName.toLowerCase()) &&
    (element.hasChildNodes() || element.shadowRoot.hasChildNodes())
  ) {
    element = (element.shadowRoot ? element.shadowRoot : element).querySelector(
      SUPPORTED_ELEMENTS.join(','),
    );
    return traverseElementHierarchy(element);
  }
  return element;
}

function createSelector(element) {
  // For custom elements, descend into the shadow root.
  element = traverseElementHierarchy(element);
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
  console.log('Selector is unique', isUnique(selector));
  if (isUnique(selector)) {
    // @ToDo: Only proceed if the selector is unique. Otherwise, find a new
    // selector.
  }
  return new URL(
    `#:~:selector(type=CssSelector,value=${selector})`,
    location.href,
  ).toString();
}
