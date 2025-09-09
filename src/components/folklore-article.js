import { registerFunctionComponent } from 'webact';
import style from './folklore-article.css?inline';

async function FolkloreArticle (props) {
  const { $, css, postRender, html } = this;

  css`${style}`;

  html`
    <header>
      <strong>Informationsruta</strong>
      <button id="close-button">Stäng ruta</button>
    </header>
    <main>
      <p>
        Välj en punkt i kartan för att få en utförlig beskrivning i denna ruta.
      </p>
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
