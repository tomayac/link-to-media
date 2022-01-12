/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

(async (browser) => {
  let elementAtPoint = null;

  document.addEventListener('contextmenu', (e) => {
    const { x, y } = e;
    elementAtPoint = document.elementFromPoint(x, y);
    console.log('Activated on', elementAtPoint);
  });

  browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.selection && elementAtPoint) {
        try {
          const link = createLink(elementAtPoint);
          console.log('Created link', link);
          await copyToClipboard(link);
          await highlightElement(elementAtPoint);
          sendResponse(link);
        } catch (err) {
          console.error(err.name, err.message);
        }
      }
    },
  );

  const highlightElement = (element) => {
    const previousOutline = element.style.outline;
    const previousOutlineOffset = element.style.outlineOffset;
    element.style.outline = 'Highlight solid 3px';
    element.style.outlineOffset = '-3px';
    setTimeout(() => {
      element.style.outline = previousOutline;
      element.style.outlineOffset = previousOutlineOffset;
    }, 1000);
  };

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
