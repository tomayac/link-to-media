/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

(async (browser) => {
  // Need to roll my own `chrome.runtime.getMessage()` replacement due to
  // https://crbug.com/1159438.
  function loadMessages(language) {
    return fetch(`_locales/${language}/messages.json`).then((response) =>
      response.json(),
    );
  }

  const languages = await new Promise((resolve) =>
    browser.i18n.getAcceptLanguages(resolve),
  );
  const language = languages[0].split('-')[0];
  const messages = await loadMessages(language).catch((_) =>
    loadMessages('en'),
  );

  browser.contextMenus.create({
    id: 'link-to-media',
    title: messages.contextMenuTitle.message,
    contexts: ['image', 'video', 'audio'],
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    const { mediaType, srcUrl } = info;
    console.log('Activated on', mediaType, srcUrl);
    browser.tabs.sendMessage(
      tab.id,
      {
        selection: {
          mediaType,
          srcUrl,
        },
      },
      (response) => {
        console.log(response);
      },
    );
  });
})(chrome || browser);
