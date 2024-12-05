const E=()=>{const o=document.getElementById("logout-button");o&&o.addEventListener("click",function(){console.log("Logout button clicked"),localStorage.clear(),sessionStorage.clear(),window.location.pathname.endsWith("/index.html")||window.location.pathname==="/"?window.location.reload():window.location.href="../../index.html"})};async function L(){if(!document.body.classList.contains("create-listing-page"))return;const o=localStorage.getItem("token"),e=localStorage.getItem("api_key"),n=document.getElementById("new-listing-form"),t=document.getElementById("new-listing-title"),i=document.getElementById("new-listing-description"),s=document.getElementById("new-listing-category"),r=document.getElementById("new-listing-image"),c=document.getElementById("new-listing-ends-at"),g=document.getElementById("new-listing-button");if(!n||!t||!i||!s||!r||!g||!c){console.error("Required input or button elements are missing.");return}g.addEventListener("click",async w=>{console.log("New listing button clicked."),w.preventDefault();const a=t.value.trim(),u=i.value.trim(),m=s.value.trim(),p=r.value.trim(),y=c.value.trim();if(!a||!u||!m||!p||!y){alert("Please fill in all fields correctly."),console.error("One or more fields are empty or invalid.");return}try{const d=new Headers({"Content-Type":"application/json","X-Noroff-API-Key":e,Authorization:`Bearer ${o}`}),f=JSON.stringify({title:a,description:u,tags:m,media:[{url:p,alt:a}],endsAt:y});console.log("Request Payload:",f);const l=await fetch("https://v2.api.noroff.dev/auction/listings",{method:"POST",headers:d,body:f});if(!l.ok)throw new Error(`New listing request failed: ${l.status} ${l.statusText}`);const h=await l.json();console.log("New listing created successfully:",h),alert("New listing created successfully!")}catch(d){console.error("Error creating new listing:",d.message),alert("Failed to create new listing.")}})}function v(){if(!document.body.classList.contains("homepage"))return;const o=document.querySelector(".listings-container");fetch("https://v2.api.noroff.dev/auction/listings").then(e=>{if(!e.ok)throw new Error("Failed to fetch listings");return e.json()}).then(e=>{if(console.log(e),!Array.isArray(e)){console.error("Expected an array but received:",e);return}e.forEach(n=>{const t=document.createElement("div");t.classList.add("listing-card");const i=document.createElement("img");i.src=n.image,i.alt=n.title;const s=document.createElement("h2");s.innerHTML=n.title;const r=document.createElement("p");r.innerHTML=`Price: ${n.price}`;const c=document.createElement("p");c.innerHTML=n.description,t.appendChild(i),t.appendChild(s),t.appendChild(r),t.appendChild(c),o.appendChild(t)})}).catch(e=>{console.error("An error occurred:",e)})}document.addEventListener("DOMContentLoaded",function(){E(),L(),v();const o=localStorage.getItem("username");if(o){const e=o.replace(/['"]+/g,""),n=document.querySelector(".logged-in-username");n&&(n.textContent="Hello, "+e+"! You are currently logged in.");const t=document.querySelector(".visible-if-logged-in");t&&(t.style.display="block")}});
