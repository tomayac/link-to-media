/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

(async (browser) => {
  const ALLOWED_ELEMENTS = ['img', 'video', 'audio'];

  let elementAtPoint = null;

  document.addEventListener('contextmenu', (e) => {
    console.log('contextmenu', e);
      const {x, y} = e;
      elementAtPoint = document.elementFromPoint(x, y);
      console.log('Activated on', elementAtPoint);
  });

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.selection) {
      let { mediaType } = request.selection;
      if (mediaType === 'image') {
        mediaType = 'img';
      }
      // Basic sanity check to make sure the right element is selected.
      if (mediaType !== elementAtPoint.tagName.toLowerCase()) {
        return;
      }
      const link = createLink(elementAtPoint);
      console.log('Created link', link);
      sendResponse(link);
    }
  });
})(chrome || browser);
