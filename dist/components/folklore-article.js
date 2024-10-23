import{registerFunctionComponent as c}from"webact";async function u(m){const{$:t,useCSS:r,postRender:o,html:a}=this;await r(),a`
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
  `;function l(){t().removeAttribute("open"),t("main").innerHTML=`
    <h1>Informationsruta</h1>
    <p>
      V\xE4lj en punkt i kartan f\xF6r att f\xE5 en utf\xF6rlig beskrivning i denna ruta.
    </p>
    `}o(()=>{const e=t("iframe");t("#close-button").addEventListener("click",()=>l());function s(){const n=e.contentDocument||e.contentWindow.document,i=n.createElement("style");i.textContent=`
        img {
          display: block;
          width: 100%;
        }
      `,n.querySelector("article").appendChild(i)}document.addEventListener("info:display",async n=>{console.log("info:display",n),t("main p").innerHTML="Laddar...",t().setAttribute("open","open"),t("main p").innerHTML="",e.setAttribute("src",n.detail.url),e.onload=s})})}var p=c(u,{metaUrl:import.meta.url,name:"folklore-article"});export{p as default};
