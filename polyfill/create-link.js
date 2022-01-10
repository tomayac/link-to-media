const BOILERPLATE = '#:~:selector(type=CssSelector,value=';

function createLink(element) {
  if (element.id) {
    return `${location.href}${BOILERPLATE}${element.id})`;
  }
  if (element.src) {
    return `${location.href}${BOILERPLATE}img[src="${element.src}"])`;
  }
}
