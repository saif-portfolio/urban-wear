const products = [
  {id:1,name:"Essential Heavyweight Tee",category:"Men",type:"T-SHIRTS",price:32,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=850&q=85",tag:"BESTSELLER",color:"Washed black",size:"S / M / L / XL",new:true},
  {id:2,name:"Relaxed Everyday Shirt",category:"Men",type:"SHIRTS",price:58,image:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=850&q=85",tag:"NEW",color:"Soft white",size:"S / M / L / XL",new:true},
  {id:3,name:"Studio Zip Hoodie",category:"Men",type:"HOODIES",price:74,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=850&q=85",tag:"NEW",color:"Heather grey",size:"S / M / L / XL",new:true},
  {id:4,name:"Utility Overshirt",category:"Men",type:"JACKETS",price:89,image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=850&q=85",tag:"LIMITED",color:"Olive",size:"S / M / L / XL",new:false},
  {id:5,name:"Straight-Leg Denim",category:"Men",type:"DENIM",price:68,image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=850&q=85",tag:"",color:"Indigo",size:"28 / 30 / 32 / 34",new:false},
  {id:6,name:"Modern Layer Jacket",category:"Men",type:"OUTERWEAR",price:112,image:"https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=850&q=85",tag:"NEW",color:"Charcoal",size:"S / M / L / XL",new:true},
  {id:7,name:"The Weekend Knit",category:"Women",type:"KNITWEAR",price:64,image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=850&q=85",tag:"BESTSELLER",color:"Cream",size:"XS / S / M / L",new:false},
  {id:8,name:"Everyday Relaxed Tee",category:"Women",type:"T-SHIRTS",price:29,image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=850&q=85",tag:"",color:"White",size:"XS / S / M / L",new:false},
  {id:9,name:"City Tailored Trousers",category:"Women",type:"TROUSERS",price:79,image:"https://images.unsplash.com/photo-1506629905607-d9d8b6f1f1a1?auto=format&fit=crop&w=850&q=85",tag:"NEW",color:"Stone",size:"XS / S / M / L",new:true},
  {id:10,name:"Soft Form Dress",category:"Women",type:"DRESSES",price:96,image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=850&q=85",tag:"NEW",color:"Black",size:"XS / S / M / L",new:true},
  {id:11,name:"Everyday Crossbody",category:"Accessories",type:"BAGS",price:48,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=850&q=85",tag:"",color:"Black",size:"ONE SIZE",new:false},
  {id:12,name:"Minimal Daily Cap",category:"Accessories",type:"ACCESSORIES",price:24,image:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=850&q=85",tag:"",color:"Black",size:"ONE SIZE",new:false}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
let activeFilter = "All";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("urbanWearCart") || "[]");
let toastTimer;

function money(value){return "$" + value.toFixed(2)}
function filteredProducts(){
  let list = products.filter(p => (activeFilter === "All" || p.category === activeFilter) &&
    (p.name.toLowerCase().includes(searchTerm) || p.type.toLowerCase().includes(searchTerm) || p.color.toLowerCase().includes(searchTerm)));
  const sort = $("#sortSelect").value;
  if(sort === "low") list.sort((a,b)=>a.price-b.price);
  if(sort === "high") list.sort((a,b)=>b.price-a.price);
  if(sort === "new") list.sort((a,b)=>Number(b.new)-Number(a.new));
  return list;
}
function renderProducts(){
  const list = filteredProducts();
  $("#productGrid").innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${p.image}" alt="${p.name} shown as a fashion product" loading="lazy">
        ${p.tag ? `<span class="product-badge">${p.tag}</span>` : ""}
        <button class="quick-add" data-add="${p.id}">ADD TO BAG +</button>
      </div>
      <div class="product-info"><div><p class="product-category">${p.category.toUpperCase()} / ${p.type}</p><h3 class="product-name">${p.name}</h3><p class="product-meta">${p.color} · ${p.size}</p></div><p class="product-price">${money(p.price)}</p></div>
    </article>`).join("");
  $("#resultCount").textContent = `${list.length} PRODUCT${list.length===1?"":"S"}`;
  $("#emptyState").hidden = list.length !== 0;
}
function saveCart(){localStorage.setItem("urbanWearCart",JSON.stringify(cart));renderCart()}
function addToCart(id){
  const found = cart.find(item=>item.id===id);
  if(found) found.qty += 1; else cart.push({id,qty:1});
  saveCart(); showToast("Added to your bag");
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty += delta; if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();
}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  $("#cartCount").textContent=count; $("#drawerCount").textContent=`(${count})`;
  $("#cartItems").innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id); if(!p)return "";
    return `<div class="cart-line"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${p.color}</p><div class="qty-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">REMOVE</button></div></div><span class="line-price">${money(p.price*item.qty)}</span></div>`;
  }).join("");
  const subtotal=cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.id);return sum+(p?p.price*item.qty:0)},0);
  $("#cartEmpty").hidden=count!==0; $("#cartSummary").hidden=count===0; $("#cartSubtotal").textContent=money(subtotal);
}
function openCart(){ $("#cartDrawer").classList.add("open");$("#drawerBackdrop").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.classList.add("no-scroll")}
function closeCart(){ $("#cartDrawer").classList.remove("open");$("#drawerBackdrop").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.classList.remove("no-scroll")}
function showToast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200)}
function setFilter(value){activeFilter=value;$$(".filter-tab").forEach(btn=>btn.classList.toggle("active",btn.dataset.filter===value));renderProducts();$("#shop").scrollIntoView({behavior:"smooth"})}

$("#productGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-add]");if(btn)addToCart(Number(btn.dataset.add))});
$("#cartItems").addEventListener("click",e=>{
  const qty=e.target.closest("[data-qty]"),remove=e.target.closest("[data-remove]");
  if(qty)changeQty(Number(qty.dataset.qty),Number(qty.dataset.delta));
  if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));saveCart()}
});
$$(".filter-tab").forEach(btn=>btn.addEventListener("click",()=>setFilter(btn.dataset.filter)));
$$("[data-category]").forEach(link=>link.addEventListener("click",()=>{activeFilter=link.dataset.category;$$(".filter-tab").forEach(btn=>btn.classList.toggle("active",btn.dataset.filter===activeFilter));renderProducts()}));
$$("[data-filter-link]").forEach(link=>link.addEventListener("click",()=>{activeFilter=link.dataset.filterLink;$$(".filter-tab").forEach(btn=>btn.classList.toggle("active",btn.dataset.filter===activeFilter));renderProducts();$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false")}));
$("#sortSelect").addEventListener("change",renderProducts);
$("#searchToggle").addEventListener("click",()=>{$("#searchPanel").hidden=!$("#searchPanel").hidden;if(!$("#searchPanel").hidden)$("#searchInput").focus()});
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();if(searchTerm)$("#shop").scrollIntoView({behavior:"smooth"})});
$("#clearSearch").addEventListener("click",()=>{$("#searchInput").value="";searchTerm="";renderProducts()});
$("#cartToggle").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#drawerBackdrop").addEventListener("click",closeCart);
$("#continueShopping").addEventListener("click",closeCart);
$("#demoCheckout").addEventListener("click",()=>showToast("This is a portfolio demo — payments are not enabled."));
$("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open))});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();$("#newsletterMessage").textContent="Thanks for your interest! This demo does not store email addresses.";e.target.reset()});
$("#newsletterForm").addEventListener("submit",()=>{});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false")}});
renderProducts();renderCart();
