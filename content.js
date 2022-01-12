/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

(async (browser) => {
  scrollTo();

  let elementAtPoint = null;

  document.addEventListener('contextmenu', (e) => {
    console.log('contextmenu', e);
    const { x, y } = e;
    elementAtPoint = document.elementFromPoint(x, y);
    console.log('Activated on', elementAtPoint);
  });

  browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
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
        try {
          await copyToClipboard(link);
        } catch (err) {
          console.error(err.name, err.message);
        }
        sendResponse(link);
      }
    },
  );

  const copyToClipboard = async (text) => {
    // Try to use the Async Clipboard API with fallback to the legacy API.
    try {
      const { state } = await navigator.permissions.query({
        name: 'clipboard-write',
      });
      if (state !== 'granted') {
        throw new Error('Clipboard permission not granted.');
      }
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      document.body.append(textArea);
      textArea.textContent = text;
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
  };
})(chrome || browser);
