(async (browser) => {
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.selection) {
      let { mediaType, srcUrl } = request.selection;
      if (mediaType === 'image') {
        mediaType = 'img';
      }
      console.log('CSS selector', `${mediaType}[src="${srcUrl}"]`);
      const matches = document.querySelectorAll(
        `${mediaType}[src="${srcUrl}"]`,
      );
      console.log('CSS selector matches', matches);
      console.log('Created link', createLink(matches[0]));
      sendResponse(createLink(matches[0]));
    }
  });
})(chrome || browser);
