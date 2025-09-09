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
      <hr>
      <div id="article-content"></div>
    </main>
  `;

  postRender(() => {
    const $p = $('main p');
    const $host = $(':host');
    const $articleContent = $('#article-content');

    $('#close-button').addEventListener('click', () => $host.removeAttribute('open'));

    document.addEventListener('info:display', async e => {
      if ($host) {
        $host.setAttribute('open', 'open');
      }

      if ($p) {
        $p.remove();
      }

      const res = await fetch(e.detail.url);
      const html = await res.text();

      const url = new URL(e.detail.url, document.location.href);

      url.pathname = url.pathname.replace('.html', '.png');

      $articleContent.innerHTML = html;

      const $img = $articleContent.querySelector('img');

      if ($img) {
        $img.src = url.toString();
      }
    });
  });
}

export default registerFunctionComponent(FolkloreArticle, {
  metaUrl: import.meta.url,
  name: 'folklore-article'
});
