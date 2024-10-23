import{registerFunctionComponent as l}from"webact";function d(i){const t=i.contentDocument||i.contentWindow.document;if(!t)return;const n=t.createElement("style");n.textContent=`
    img {
      display: block;
      width: 100%;
    }
  `;const o=t.querySelector("article");o&&o.appendChild(n)}async function m(i){const{$:t,useCSS:n,postRender:o,html:s}=this;await n(),s`
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
  `,o(()=>{const e=t("iframe"),a=t("main p"),r=t(":host");t("#close-button").addEventListener("click",()=>r.removeAttribute("open")),document.addEventListener("info:display",c=>{e.classList.add("hidden"),r&&r.setAttribute("open","open"),a&&a.remove(),e.onload=()=>{d(e),e.classList.remove("hidden")},e.setAttribute("src",c.detail.url)})})}var f=l(m,{metaUrl:import.meta.url,name:"folklore-article"});export{f as default};
