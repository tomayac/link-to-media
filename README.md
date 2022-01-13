# Link to Media Extension and Polyfill

## Extension

A browser extension that allows you to link to arbitrary `<img>`s, `<video>`s,
or `<audio>`s on webpages, according to the
[Alternative Content Types](https://github.com/WICG/scroll-to-text-fragment/blob/main/EXTENSIONS.md)
proposal.

<img width="1203" alt="Link to media extension activated on an image." src="https://user-images.githubusercontent.com/145676/149330800-b7a52f99-e03b-4a30-85fa-9e5cc6f44fc7.png">

## Polyfill

A polyfill for the
[proposal](https://github.com/WICG/scroll-to-text-fragment/blob/main/EXTENSIONS.md)
to extend the concept of
[Text Fragments](https://wicg.github.io/scroll-to-text-fragment/) to include
media.

### Installation of the polyfill

```bash
npm install --save link-to-media
```

### Usage

To create a link based on an element:

```js
import { createLink, scrollTo } from 'link-to-media';

const img = document.querySelector('img');
const link = createLink(img);
```

To scroll the page to an element based on a link:

```js
import { scrollTo } from 'link-to-media';

// This waits for `onload` internally.
scrollTo();
```

## Developing

### Scripts

```bash
npm run fix
# Beautifies the code.

npm run build
# Builds the polyfill.

npm start
# Runs a local server with test cases.
```

## License

Apache 2.0.
