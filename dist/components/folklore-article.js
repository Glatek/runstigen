import{registerFunctionComponent as d}from"webact";function g(o){const t=o.contentDocument||o.contentWindow.document;if(!t)return;const e=t.createElement("style");e.textContent=`
    img {
      display: block;
      width: 100%;
    }
  `;const n=t.querySelector("article");n&&n.appendChild(e)}async function p(o){const{$:t,useCSS:e,postRender:n,html:m}=this;await e(),m`
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
  `,n(()=>{const a=t("main p"),i=t(":host"),c=t("#article-content");t("#close-button").addEventListener("click",()=>i.removeAttribute("open")),document.addEventListener("info:display",async l=>{i&&i.setAttribute("open","open"),a&&a.remove();const u=await(await fetch(l.detail.url)).text(),r=new URL(l.detail.url,document.location.href);r.pathname=r.pathname.replace(".html",".png"),c.innerHTML=u;const s=c.querySelector("img");s&&(s.src=r.toString())})})}var y=d(p,{metaUrl:import.meta.url,name:"folklore-article"});export{y as default};
