(async (browser) => {
  // Need to roll my own `chrome.runtime.getMessage()` replacement due to
  // https://crbug.com/1159438.
  let messages;
  const getMessages = async () => {
    return (
      messages ||
      new Promise((resolve) => {
        browser.i18n.getAcceptLanguages(async (languages) => {
          const language = languages[0].split('-')[0];
          const messagesURL = browser.runtime.getURL(
            `_locales/${language}/messages.json`,
          );
          messages = await fetch(messagesURL)
            .then((response) => response.json())
            .catch(async (_) => {
              const messagesDefaultURL = browser.runtime.getURL(
                '_locales/en/messages.json',
              );
              return await fetch(messagesDefaultURL).then((response) =>
                response.json(),
              );
            });
          resolve(messages);
        });
      })
    );
  };

  browser.contextMenus.create({
    id: 'link-to-img-video-audio',
    title: (await getMessages()).contextMenuTitle.message,
    contexts: ['image', 'video', 'audio'],
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    const { mediaType, srcUrl } = info;
    console.log(mediaType, srcUrl, tab.id);
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
