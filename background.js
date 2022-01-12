/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

(async (browser) => {
  // Need to roll my own `chrome.runtime.getMessage()` replacement due to
  // https://crbug.com/1159438.
  async function loadMessages(language) {
    return fetch(`_locales/${language}/messages.json`).then((response) =>
      response.json(),
    );
  }

  const language = browser.i18n.getUILanguage().split('-', 1)[0];
  const messages = await loadMessages(language).catch((_) =>
    loadMessages('en'),
  );

  await browser.contextMenus.create({
    id: 'link-to-media',
    title: messages.contextMenuTitle.message,
    contexts: ['image', 'video', 'audio'],
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    const { mediaType, srcUrl } = info;
    console.log('Activated on', mediaType, srcUrl);
    const response = await browser.tabs.sendMessage(tab.id, {
      selection: {
        mediaType,
        srcUrl,
      },
    });
    console.log(response);
  });
})(chrome || browser).catch(console.error);
