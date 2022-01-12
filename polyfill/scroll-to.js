/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function waitForWindowEvent(event) {
  return new Promise((resolve) =>
    addEventListener(event, resolve, { once: true }),
  );
}

function waitForAnimationFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

// Via https://github.com/flackr/scroll-to-extension/blob/main/src/scroll-to.js.
async function scrollTo() {
  const regExp = /[^#]*#.*:~:selector\(type=CssSelector,value=(.*)\)$/;
  // Scroll to image only supports a simple or compound selector selecting on
  // type, id, class and attribute selectors with a specific list of allowed
  // attribute names to select on. See
  // https://github.com/WICG/scroll-to-text-fragment/blob/main/EXTENSIONS.md#css-selector-restrictions
  // for details.
  const validSelector =
    /^([#.]?[-_a-zA-Z0-9]+(\[ *(alt|href|poster|src|srcset|style) *([$^*|~]?= *("[^"]*"|'[^']*'|[^\] ]*))? *\])*)+$/;
  const entry = performance.getEntriesByType('navigation')[0];
  const match = entry.name.match(regExp);
  if (!match || match.length !== 2) return;
  let matchStr = decodeURIComponent(match[1]).trim();
  if (!matchStr.match(validSelector)) {
    console.error(
      'Invalid selector specified, see selector limitations at https://github.com/WICG/scroll-to-text-fragment/blob/main/EXTENSIONS.md#css-selector-restrictions',
      matchStr,
    );
    return;
  }
  const elem = document.querySelector(matchStr);
  if (!elem) {
    console.error('Failed to select element from selector:', matchStr);
    return;
  }
  const previousOutline = elem.style.outline;
  elem.style.outline = 'Highlight solid 3px';
  // Need to wait for the load event to ensure the scroll does not get
  // undone by the browsers anchor link scroll behavior.
  await waitForWindowEvent('load');
  // Wait until the second frame after the load to scroll the element into
  // view. Scrolling immediately seems to sometimes fail.
  await waitForAnimationFrame();
  await waitForAnimationFrame();
  elem.scrollIntoView();
  await waitForAnimationFrame();
  // Wait until the element is scrolled into view to add a listener to
  // cancel the highlight.
  await waitForWindowEvent('scroll');
  elem.style.outline = previousOutline;
}
