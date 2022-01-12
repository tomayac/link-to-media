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
  // Need to wait for the load event to ensure the scroll does not get
  // undone by the browsers anchor link scroll behavior.
  await waitForWindowEvent('load');
  let elem = document.querySelector(matchStr);
  if (!elem) {
    let observer;
    try {
      elem = await new Promise((resolve, reject) => {
        observer = new MutationObserver((mutations) => {
          for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
              if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.matches(matchStr)
              ) {
                return resolve(node);
              }
            }
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
        setTimeout(
          () =>
            reject(
              new Error('Failed to select element from selector ' + matchStr),
            ),
          1000,
        );
      });
    } finally {
      observer?.disconnect();
    }
  }
  const previousOutline = elem.style.outline;
  elem.style.outline = 'Highlight solid 3px';
  elem.scrollIntoView();
  // Wait until the element is scrolled into view to add a listener to
  // cancel the highlight.
  await waitForAnimationFrame();
  await waitForWindowEvent('scroll');
  elem.style.outline = previousOutline;
}
