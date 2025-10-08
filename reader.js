// reader.js
const chapterKey = window.location.pathname;

function detectMode() {
  const imgs = document.querySelectorAll("img");
  return imgs.length > 1 ? "multi" : "scroll";
}

const mode = detectMode();

// --- Scroll mode ---
if (mode === "scroll") {
  const scrollKey = chapterKey + "_scrollY";
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(scrollKey, window.scrollY);
  });
  window.addEventListener("load", () => {
    const saved = localStorage.getItem(scrollKey);
    if (saved) window.scrollTo({ top: parseInt(saved), behavior: "smooth" });
  });
}

// --- Multi-image mode ---
if (mode === "multi") {
  const pageKey = chapterKey + "_pageIndex";
  const pages = Array.from(document.querySelectorAll("img"));
  let currentPage = 0;

  const nav = document.createElement("div");
  nav.style = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:9999;";
  const btnPrev = document.createElement("button");
  const btnNext = document.createElement("button");
  const info = document.createElement("span");
  btnPrev.textContent = "⬅️ Trước";
  btnNext.textContent = "➡️ Sau";
  info.style = "color:white;padding:6px 10px;";
  [btnPrev, btnNext].forEach(b=>{
    Object.assign(b.style,{padding:"8px 14px",border:"none",borderRadius:"6px",cursor:"pointer",background:"#ff5722",color:"#fff"});
  });
  nav.append(btnPrev, info, btnNext);
  document.body.appendChild(nav);

  function showPage(i){
    i=Math.max(0,Math.min(i,pages.length-1));
    pages.forEach((img,idx)=>img.style.display=idx===i?"block":"none");
    currentPage=i;
    info.textContent=`Trang ${i+1}/${pages.length}`;
    localStorage.setItem(pageKey,i);
  }

  btnPrev.onclick=()=>showPage(currentPage-1);
  btnNext.onclick=()=>showPage(currentPage+1);

  window.addEventListener("load",()=>{
    const saved=localStorage.getItem(pageKey);
    showPage(saved?parseInt(saved):0);
  });
}

// --- Reset button ---
window.addEventListener("DOMContentLoaded",()=>{
  const btn=document.createElement("button");
  btn.textContent="🔁 Đọc lại từ đầu";
  Object.assign(btn.style,{position:"fixed",bottom:"20px",right:"20px",padding:"10px 16px",fontSize:"14px",border:"none",borderRadius:"8px",cursor:"pointer",background:"#ff5722",color:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.3)",zIndex:9999});
  btn.onclick=()=>{
    for(const key of [chapterKey+"_scrollY",chapterKey+"_pageIndex"])localStorage.removeItem(key);
    if(mode==="scroll")window.scrollTo({top:0,behavior:"smooth"});
    if(mode==="multi")location.reload();
  };
  document.body.appendChild(btn);
});
