function f(o){const t=o.currentTarget,n=t.previousElementSibling;console.log("Show Password Button Clicked:",t),console.log("Password Input Element:",n),n?n.type==="password"?(n.type="text",t.querySelector(".fa-eye-slash").classList.remove("hide"),t.querySelector(".fa-eye").classList.add("hide")):(n.type="password",t.querySelector(".fa-eye-slash").classList.add("hide"),t.querySelector(".fa-eye").classList.remove("hide")):console.error("Password input not found.")}const E="https://v2.api.noroff.dev",v=`${E}/auth`,S=`${v}/login`,T=`${v}/register`,b=()=>{const o=document.getElementById("login-email"),t=document.getElementById("login-password"),n=document.querySelector(".show-password"),r=document.getElementById("login-error"),e=document.getElementById("login-btn");return{email:o,password:t,showPasswordBtn:n,errorMessage:r,loginBtn:e}},I=()=>{const o=document.getElementById("username"),t=document.getElementById("register-email"),n=document.getElementById("register-password"),r=document.querySelector(".show-password"),e=document.getElementById("error-message"),a=document.getElementById("success-message"),s=document.getElementById("register-btn");return{username:o,email:t,password:n,showPasswordBtn:r,errorMessage:e,successMessage:a,registerBtn:s}};function A(){const{username:o,email:t,password:n,showPasswordBtn:r,errorMessage:e,successMessage:a,registerBtn:s}=I();if(!r||!n){console.error("Required elements for show-password functionality are missing.");return}r.addEventListener("click",f),s.addEventListener("click",async function(i){if(i.preventDefault(),e.style.display="none",a.style.display="none",o.value.length<2||t.value.length<2||n.value.length<2){e.style.display="block",e.innerHTML="All fields must be filled in.",console.log("All fields must be filled in.");return}if(n.value.length<9){e.innerHTML="The password must contain more than 9 characters.",e.style.display="block",console.log("The password must contain more than 9 characters.");return}if(n.value.length>20){e.innerHTML="The password must contain less than 20 characters.",e.style.display="block",console.log("The password must contain less than 20 characters.");return}if(!t.value.includes("@stud.noroff.no")){e.innerHTML="The email must end with @stud.noroff.no.",e.style.display="block",console.log("The email must end with @stud.noroff.no.");return}if(!/^[a-zA-Z0-9]+$/.test(o.value)){e.innerHTML="The username must only contain letters and numbers.",e.style.display="block",console.log("The username must only contain letters and numbers.");return}const l={name:o.value,email:t.value,bio:"Default bio",avatar:{url:"https://github.com/elanetto/FED1-PE1-elanetto/blob/main/assets/images/user/avatar-user-default.png?raw=true",alt:"User  Avatar"},banner:{url:"https://github.com/elanetto/FED1-PE1-elanetto/blob/main/assets/images/200kb-images/kewater_view-01.jpg?raw=true",alt:"User  Banner"},venueManager:!0,password:n.value};try{const c=await(await fetch(T,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)})).json();if(console.log(c),c.errors){console.log(c.errors),e.style.display="block",e.innerHTML=c.errors.map(u=>u.message).join("<br>"),console.log(c.errors);return}c.email&&(localStorage.setItem("username",c.name),localStorage.setItem("email",c.email),localStorage.setItem("avatar",c.avatar.url),localStorage.setItem("banner",c.banner.url),a.style.display="block",console.log("User registered successfully."),setTimeout(()=>{window.location.href="account/login/"},3e3))}catch(d){console.log(d),e.style.display="block",e.innerHTML="Something went wrong. Please try again."}document.querySelector(".register-form").reset()})}function P(){const{email:o,password:t,showPasswordBtn:n,errorMessage:r,loginBtn:e}=b();if(!o||!e||!r||!t||!n)return;const a=n.querySelector(".fa-eye-slash"),s=n.querySelector(".fa-eye");if(!a||!s)return;function i(){t.type==="password"?(a.classList.add("hide"),s.classList.remove("hide")):(a.classList.remove("hide"),s.classList.add("hide"))}i(),n.removeEventListener("click",f),n.addEventListener("click",f),e.addEventListener("click",async function(l){var g,w;l.preventDefault();const d=o.value.trim(),c=t.value.trim();if(!B(d)){r.textContent="Email not valid",r.style.display="block";return}if(c.length===0){r.textContent="Please enter a password",r.style.display="block";return}const u={email:d,password:c};try{const p=await fetch(S,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)}),m=await p.json();if(p.ok)localStorage.setItem("username",m.data.name),localStorage.setItem("email",m.data.email),localStorage.setItem("avatar",m.data.avatar.url),localStorage.setItem("banner",m.data.banner.url),localStorage.setItem("token",m.data.accessToken),window.location.href="../../account/myaccount/";else{const k=((w=(g=m.errors)==null?void 0:g[0])==null?void 0:w.message)||"An error occurred during login.";r.textContent=k,r.style.display="block"}}catch{r.textContent="An error occurred with your login request.",r.style.display="block"}})}function B(o){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o)}function L(){const o=localStorage.getItem("username"),t=localStorage.getItem("email"),n=localStorage.getItem("avatar"),r=localStorage.getItem("banner"),e=document.querySelector(".username-from-local-storage");o&&e&&(e.textContent=o);const a=document.querySelector(".email-from-local-storage");t&&a&&(a.textContent=t);const s=document.querySelector(".avatar-from-local-storage");n&&s&&(s.style.backgroundImage=`url(${n})`,s.style.backgroundSize="cover",s.style.backgroundPosition="center");const i=document.querySelector(".banner-from-local-storage");r&&i&&(i.style.backgroundImage=`url(${r})`,i.style.backgroundSize="cover",i.style.backgroundPosition="center")}function y(){const o=localStorage.getItem("token");if(!o){console.error("No token found");return}const t=o.replace(/['"]+/g,""),n=new Headers;return n.append("Authorization",`Bearer ${t}`),fetch("https://v2.api.noroff.dev/auth/create-api-key",{method:"POST",headers:n,redirect:"follow"}).then(e=>{if(!e.ok)throw new Error(`API key request failed: ${e.status} ${e.statusText}`);return e.json()}).then(e=>{var s;const a=(s=e==null?void 0:e.data)==null?void 0:s.key;if(!a)throw new Error("API key not found in response");return localStorage.setItem("api_key",a),a}).catch(e=>(console.error("Error fetching API key:",e),null))}function h(){const o=localStorage.getItem("token"),t=localStorage.getItem("username");if(!o)return null;const n=o.replace(/['"]+/g,"");if(!t)return null;const r=t.replace(/['"]+/g,"");return{cleanedToken:n,cleanedUsername:r}}function $(){const o=h();if(!o){console.warn("Token details are not available. Skipping profile picture setup.");return}const{cleanedToken:t,cleanedUsername:n}=o,r=document.getElementById("avatar-input"),e=document.getElementById("change-avatar-button");if(!r||!e){console.warn("Profile picture input or button not found. Skipping setup.");return}e.addEventListener("click",async a=>{a.preventDefault();const s=r.value.trim();if(!s||!q(s)){alert("Please enter a valid URL.");return}try{const i=await y();if(!i){alert("Unable to fetch API key.");return}const l=new Headers;l.append("Content-Type","application/json"),l.append("X-Noroff-API-Key",i),l.append("Authorization",`Bearer ${t}`);const d=JSON.stringify({avatar:{url:s,alt:"Avatar"}}),c={method:"PUT",headers:l,body:d,redirect:"follow"},u=await fetch(`https://v2.api.noroff.dev/social/profiles/${n}`,c);if(!u.ok)throw console.error("Request failed:",u.status,u.statusText),new Error(`Failed to update profile picture: ${u.status} ${u.statusText}`);const g=await u.json();localStorage.setItem("avatar",s),alert("Your profile picture has been updated!"),location.reload()}catch(i){console.error("An error occurred while updating the profile picture:",i),alert("An error occurred while updating your profile picture.")}})}function q(o){try{return new URL(o),!0}catch{return!1}}function U(){const o=h();if(!o){console.error("Failed to fetch token details.");return}const{cleanedToken:t,cleanedUsername:n}=o;if(!t||!n){console.error("Token or username is missing.");return}const r=document.getElementById("banner-input"),e=document.getElementById("change-banner-button");if(!r||!e){console.error("Required input or button elements are missing.");return}e.addEventListener("click",async a=>{a.preventDefault();const s=r.value.trim();if(!s||!H(s)){alert("Please enter a valid URL."),console.error("Invalid or empty URL:",s);return}try{const i=await y();if(!i){console.error("Failed to fetch API key."),alert("Unable to fetch API key.");return}const l=new Headers;l.append("Content-Type","application/json"),l.append("X-Noroff-API-Key",i),l.append("Authorization",`Bearer ${t}`);const d=JSON.stringify({avatar:{url:s,alt:"Avatar"}}),c={method:"PUT",headers:l,body:d,redirect:"follow"},u=await fetch(`https://v2.api.noroff.dev/social/profiles/${n}`,c);if(!u.ok)throw console.error("Request failed:",u.status,u.statusText),new Error(`Failed to update profile picture: ${u.status} ${u.statusText}`);const g=await u.json();localStorage.setItem("banner",s),alert("Your profile banner has been updated!"),location.reload()}catch(i){console.error("Error updating profile banner:",i),alert("An error occurred while updating your banner.")}})}function H(o){try{return new URL(o),!0}catch{return!1}}const M=()=>{if(document.body.classList.contains("my-account-page")){if(!sessionStorage.getItem("myAccountReloaded")){sessionStorage.setItem("myAccountReloaded","true"),location.reload();return}document.getElementById("avatar-input")&&document.getElementById("change-avatar-button")&&$(),document.getElementById("banner-input")&&document.getElementById("change-banner-button")&&U()}};function C(){if(!document.body.classList.contains("my-account-page"))return;const o=localStorage.getItem("token"),t=localStorage.getItem("api_key"),n=localStorage.getItem("username"),r=o.replace(/['"]+/g,""),e=n.replace(/['"]+/g,"");fetch(`https://v2.api.noroff.dev/auction/profiles/${e}/listings`,{method:"GET",headers:{"X-Noroff-API-Key":t,Authorization:`Bearer ${r}`,"Content-Type":"application/json"}}).then(a=>{if(a.ok)return a.json();throw new Error("Failed to fetch listings")}).then(a=>{const s=a&&Array.isArray(a.data)?a.data:[];if(!Array.isArray(s)||s.length===0)return;const i=document.getElementById("listings-container");if(!i){console.error("Listings container not found in DOM");return}s.forEach(l=>{const d=document.createElement("div");d.classList.add("listing-card");const c=l.media&&l.media[0]&&l.media[0].url?l.media[0].url:"default-image.jpg",u=l.price||"N/A";d.innerHTML=`
                <div class="listing-image" style="background-image: url('${c}')"></div>
                <div class="listing-details">
                    <h3>${l.title}</h3>
                    <p>${l.description}</p>
                    <p>Price: $${u}</p>
                    <p>Ends at: ${l.endsAt}</p>
                </div>
                <div class="listing-actions">
                    <button class="edit-listing" data-id="${l.id}">Edit</button>
                    <button class="delete-listing" data-id="${l.id}">Delete</button>
                </div>
            `,i.appendChild(d)})}).catch(a=>{console.error("Error fetching listings:",a)})}document.addEventListener("DOMContentLoaded",function(){b(),P(),L(),h(),M(),y(),C(),(document.getElementById("register-form")?I():null)&&A();const t=localStorage.getItem("username");if(!t)return;const n=t.replace(/['"]+/g,""),r=document.querySelector(".logged-in-username");r&&(r.textContent=`Hello, ${n}! You are currently logged in.`),document.querySelectorAll(".visible-if-logged-in").forEach(a=>{a&&(a.style.display="block")})});