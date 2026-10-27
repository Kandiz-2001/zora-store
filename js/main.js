const products = [
 {id:1,name:"The Forma Shoulder Bag",category:"Accessories",type:"Leather goods",price:420,tag:"ZORA ICON",color:"Espresso",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",desc:"Sculptural lines meet everyday function. Crafted to move effortlessly from day to after dark."},
 {id:2,name:"Sculpted Evening Dress",category:"Women",type:"Ready-to-wear",price:680,tag:"NEW SEASON",color:"Black",image:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",desc:"A confident silhouette with a clean neckline and a considered, fluid drape."},
 {id:3,name:"The Everyday Loafer",category:"Men",type:"Footwear",price:360,tag:"BESTSELLER",color:"Black",image:"https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=85",desc:"A modern classic, designed with quiet detail and all-day ease."},
 {id:4,name:"Arc Mini Top Handle",category:"Accessories",type:"Leather goods",price:510,tag:"LIMITED EDITION",color:"Oxblood",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",desc:"A compact statement piece with a precise shape and room for the essentials."},
 {id:5,name:"The Atelier Blazer",category:"Men",type:"Ready-to-wear",price:740,tag:"THE NEW FORM",color:"Stone",image:"https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85",desc:"Tailoring that feels considered, never constrained. Made to be worn your way."},
 {id:6,name:"Soft Form Sunglasses",category:"Accessories",type:"Accessories",price:190,tag:"NEW",color:"Tortoise",image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",desc:"An architectural frame that adds a little attitude to the everyday."},
 {id:7,name:"The Line Knit",category:"Women",type:"Ready-to-wear",price:290,tag:"EVERYDAY ICON",color:"Cream",image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",desc:"A soft, versatile knit with a refined fit and a tactile finish."},
 {id:8,name:"Weekender No. 01",category:"Men",type:"Travel",price:590,tag:"TRAVEL EDIT",color:"Olive",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",desc:"A refined travel companion made for short escapes and long weekends."}
];
let activeFilter = "All", searchTerm = "", showAll = false;
let cart = JSON.parse(localStorage.getItem("zoraCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("zoraWishlist") || "[]");
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
const grid = $("#productGrid");
function persist(){localStorage.setItem("zoraCart",JSON.stringify(cart));localStorage.setItem("zoraWishlist",JSON.stringify(wishlist));}
function toast(message){const t=$("#toastMessage");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2300);}
function visibleProducts(){
 let list=products.filter(p=>(activeFilter==="All"||p.category===activeFilter)&&(p.name+" "+p.type+" "+p.color+" "+p.category).toLowerCase().includes(searchTerm.toLowerCase()));
 const sort=$("#sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price);
 return showAll?list:list.slice(0,8);
}
function renderProducts(){
 const list=visibleProducts();
 if(!list.length){grid.innerHTML='<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-search"></i>No pieces found. Try another search.</div>';return;}
 grid.innerHTML=list.map(p=>`<article class="product-card">
 <div class="product-visual" data-view="${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="wish-button ${wishlist.includes(p.id)?"saved":""}" data-wish="${p.id}" aria-label="Save ${p.name}"><i class="bi ${wishlist.includes(p.id)?"bi-heart-fill":"bi-heart"}"></i></button><button class="quick-view" data-view="${p.id}">QUICK VIEW <i class="bi bi-arrow-up-right"></i></button></div>
 <div class="product-info"><p class="product-category">${p.category} / ${p.type}</p><div class="product-name-row"><h3 class="product-name">${p.name}</h3><span class="product-price">${money(p.price)}</span></div><p class="product-desc">${p.color} · Considered design</p></div></article>`).join("");
}
function updateCounts(){
 $("#bagCount").textContent=cart.reduce((n,i)=>n+i.qty,0);$("#wishCount").textContent=wishlist.length;
 $("#drawerCount").textContent=`(${cart.reduce((n,i)=>n+i.qty,0)})`;$("#wishDrawerCount").textContent=`(${wishlist.length})`;
}
function renderCart(){
 const host=$("#cartItems");
 if(!cart.length)host.innerHTML='<div class="empty-state"><i class="bi bi-bag"></i>Your bag is taking a little breather.<br>Find something that feels like you.</div>';
 else host.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-line"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${p.color} · One size</p><span class="line-price">${money(p.price)}</span><div class="qty-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div><button class="remove-item" data-remove="${p.id}">Remove</button></div><strong class="line-price">${money(p.price*item.qty)}</strong></div>`}).join("");
 $("#subtotal").textContent=money(cart.reduce((n,i)=>n+products.find(p=>p.id===i.id).price*i.qty,0));updateCounts();
}
function renderWishlist(){
 const host=$("#wishItems"),items=products.filter(p=>wishlist.includes(p.id));
 if(!items.length)host.innerHTML='<div class="empty-state"><i class="bi bi-heart"></i>Your wishlist is waiting for its first find.</div>';
 else host.innerHTML=items.map(p=>`<div class="cart-line"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${p.color}</p><span class="line-price">${money(p.price)}</span><button class="remove-item" data-wish="${p.id}">Remove from wishlist</button><button class="remove-item" data-add="${p.id}">Add to bag</button></div></div>`).join("");
 updateCounts();
}
function openDrawer(id){closeDrawers();$("#overlay").classList.add("active");$(id).classList.add("open");$(id).setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeDrawers(){$$(".side-drawer").forEach(d=>{d.classList.remove("open");d.setAttribute("aria-hidden","true")});$("#overlay").classList.remove("active");document.body.style.overflow="";}
function addToCart(id,qty=1){const item=cart.find(i=>i.id===id);if(item)item.qty+=qty;else cart.push({id,qty});persist();renderCart();toast("Added to your bag.");}
function toggleWish(id){wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];persist();renderProducts();renderWishlist();toast(wishlist.includes(id)?"Saved to your wishlist.":"Removed from your wishlist.");}
function showProduct(id){
 const p=products.find(x=>x.id===id);
 $("#productModalBody").innerHTML=`<div class="modal-product"><img src="${p.image}" alt="${p.name}"><div class="modal-product-copy"><p class="eyebrow">${p.category.toUpperCase()} / ${p.type.toUpperCase()}</p><h2>${p.name}</h2><div class="modal-price">${money(p.price)}</div><p>${p.desc}</p><p>Colour: <strong>${p.color}</strong></p><label for="sizeSelect">SELECT SIZE</label><select id="sizeSelect"><option>One size</option><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option></select><button class="button button-dark" id="modalAdd" data-id="${p.id}">ADD TO BAG <i class="bi bi-arrow-up-right"></i></button><p class="modal-note">Complimentary delivery on qualifying orders. Secure checkout integration can be added when you connect a payment provider.</p></div></div>`;
 bootstrap.Modal.getOrCreateInstance($("#productModal")).show();
}
grid.addEventListener("click",e=>{
 const wish=e.target.closest("[data-wish]");if(wish){e.stopPropagation();toggleWish(Number(wish.dataset.wish));return;}
 const view=e.target.closest("[data-view]");if(view)showProduct(Number(view.dataset.view));
});
$$(".filter-tab").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.filter;$$(".filter-tab").forEach(b=>b.classList.toggle("active",b===btn));renderProducts();}));
$$("[data-category]").forEach(a=>a.addEventListener("click",()=>{activeFilter=a.dataset.category;$$(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));renderProducts();}));
$$("[data-category-link]").forEach(a=>a.addEventListener("click",()=>{activeFilter=a.dataset.categoryLink;$$(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));renderProducts();}));
$("#sortSelect").addEventListener("change",renderProducts);
$("#loadMore").addEventListener("click",()=>{showAll=!showAll;$("#loadMore").innerHTML=showAll?'SHOW LESS <i class="bi bi-arrow-up"></i>':'EXPLORE THE EDIT <i class="bi bi-arrow-down-right"></i>';renderProducts();});
$("#searchToggle").addEventListener("click",()=>{$("#searchPanel").classList.toggle("open");if($("#searchPanel").classList.contains("open"))$("#searchInput").focus();});
$("#closeSearch").addEventListener("click",()=>$("#searchPanel").classList.remove("open"));
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value;activeFilter="All";$$(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.filter==="All"));renderProducts();if(searchTerm)$("#shop").scrollIntoView({behavior:"smooth",block:"start"});});
$("#bagToggle").addEventListener("click",()=>{renderCart();openDrawer("#cartDrawer")});
$("#wishlistToggle").addEventListener("click",()=>{renderWishlist();openDrawer("#wishDrawer")});
$("#overlay").addEventListener("click",closeDrawers);$$(".close-drawer").forEach(b=>b.addEventListener("click",closeDrawers));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawers()});
document.addEventListener("click",e=>{
 const qty=e.target.closest("[data-qty]");if(qty){const id=Number(qty.dataset.qty),item=cart.find(i=>i.id===id);item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(i=>i.id!==id);persist();renderCart();return;}
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));persist();renderCart();toast("Removed from your bag.");return;}
 const wish=e.target.closest("#wishItems [data-wish]");if(wish){toggleWish(Number(wish.dataset.wish));return;}
 const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add));return;}
 const modalAdd=e.target.closest("#modalAdd");if(modalAdd){addToCart(Number(modalAdd.dataset.id));bootstrap.Modal.getOrCreateInstance($("#productModal")).hide();}
});
$("#checkoutBtn").addEventListener("click",()=>toast(cart.length?"Checkout demo only — connect a payment provider to accept orders.":"Your bag is empty."));
$("#accountBtn").addEventListener("click",()=>toast("Customer accounts can be connected in the next build."));
$("#currencyBtn").addEventListener("click",()=>toast("Region selector can be connected to your store settings."));
$("#mobileMenu").addEventListener("click",()=>$("#mainNav").classList.toggle("mobile-open"));
$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("mobile-open")));
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();const email=$("#emailInput").value.trim();if(!email)return;$("#newsletterMessage").textContent="You're on the list. Welcome to ZORA.";$("#emailInput").value="";toast("Thank you for joining ZORA.");});
renderProducts();renderCart();renderWishlist();