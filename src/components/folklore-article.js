import { registerFunctionComponent } from 'webact';

async function FolkloreArticle (props) {
  const { $, useCSS, postRender, html } = this;

  await useCSS();

  html`
    <header>
      <button id="close-button">Stäng ruta</button>
    </header>
    <main>
      <h1>Informationsruta</h1>
      <p>
        Välj en punkt i kartan för att få en utförlig beskrivning i denna ruta.
      </p>
      <iframe src=""></iframe>
    </main>
  `;

  function closePage() {
    $().removeAttribute('open');
    $('main').innerHTML = `
    <h1>Informationsruta</h1>
    <p>
      Välj en punkt i kartan för att få en utförlig beskrivning i denna ruta.
    </p>
    `;
  }

  postRender(() => {
    const $iframe = $('iframe');
    $('#close-button').addEventListener('click', () => closePage());

    function addIframeStyles () {
      const iframeDocument = $iframe.contentDocument || $iframe.contentWindow.document;

      const style = iframeDocument.createElement('style');
      style.textContent = `
        img {
          display: block;
          width: 100%;
        }
      `;

      iframeDocument.querySelector('article').appendChild(style);
    }

    document.addEventListener('info:display', async e => {
      console.log('info:display', e);
      $('main p').innerHTML = 'Laddar...';

      $().setAttribute('open', 'open');

      $('main p').innerHTML = '';
      $iframe.setAttribute('src', e.detail.url);
      $iframe.onload = addIframeStyles;

      /*
      const htmlPromise = fetch(e.detail.url).then(r => r.text());
      const animationTimeout = new Promise(r => setTimeout(() => r(), 500));

      const [html] = await Promise.all([
        htmlPromise,
        animationTimeout
      ]);

      const fragment = document.createRange().createContextualFragment(html);

      requestAnimationFrame(() => {
        $('main').innerHTML = '';
        $('main').appendChild(fragment);
      });
      */
    });
  });
}

export default registerFunctionComponent(FolkloreArticle, {
  metaUrl: import.meta.url,
  name: 'folklore-article'
});
