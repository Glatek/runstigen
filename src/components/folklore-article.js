import { registerFunctionComponent } from 'webact';

function addIframeStyles (iframe) {
  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

  if (!iframeDocument) {
    return;
  }

  const $style = iframeDocument.createElement('style');
  $style.textContent = `
    img {
      display: block;
      width: 100%;
    }
  `;

  const $article = iframeDocument.querySelector('article');

  if ($article) {
    $article.appendChild($style);
  }
}

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

  postRender(() => {
    const $iframe = $('iframe');
    const $p = $('main p');
    const $host = $(':host');

    $('#close-button').addEventListener('click', () => $host.removeAttribute('open'));

    document.addEventListener('info:display', e => {
      $iframe.classList.add('hidden');

      if ($host) {
        $host.setAttribute('open', 'open');
      }

      if ($p) {
        $p.remove();
      }

      $iframe.onload = () => {
        addIframeStyles($iframe);
        $iframe.classList.remove('hidden');
      };

      $iframe.setAttribute('src', e.detail.url);
    });
  });
}

export default registerFunctionComponent(FolkloreArticle, {
  metaUrl: import.meta.url,
  name: 'folklore-article'
});
