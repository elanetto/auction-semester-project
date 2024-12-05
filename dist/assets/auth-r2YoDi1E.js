function p(r){const t=r.currentTarget,n=t.previousElementSibling;console.log("Show Password Button Clicked:",t),console.log("Password Input Element:",n),n?n.type==="password"?(n.type="text",t.querySelector(".fa-eye-slash").classList.remove("hide"),t.querySelector(".fa-eye").classList.add("hide")):(n.type="password",t.querySelector(".fa-eye-slash").classList.add("hide"),t.querySelector(".fa-eye").classList.remove("hide")):console.error("Password input not found.")}const E="https://v2.api.noroff.dev",b=`${E}/auth`,S=`${b}/login`,T=`${b}/register`,v=()=>{const r=document.getElementById("login-email"),t=document.getElementById("login-password"),n=document.querySelector(".show-password"),o=document.getElementById("login-error"),e=document.getElementById("login-btn");return{email:r,password:t,showPasswordBtn:n,errorMessage:o,loginBtn:e}},I=()=>{const r=document.getElementById("username"),t=document.getElementById("register-email"),n=document.getElementById("register-password"),o=document.querySelector(".show-password"),e=document.getElementById("error-message"),s=document.getElementById("success-message"),a=document.getElementById("register-btn");return{username:r,email:t,password:n,showPasswordBtn:o,errorMessage:e,successMessage:s,registerBtn:a}};function P(){const{username:r,email:t,password:n,showPasswordBtn:o,errorMessage:e,successMessage:s,registerBtn:a}=I();if(!o||!n){console.error("Required elements for show-password functionality are missing.");return}o.addEventListener("click",p),a.addEventListener("click",async function(l){if(l.preventDefault(),e.style.display="none",s.style.display="none",r.value.length<2||t.value.length<2||n.value.length<2){e.style.display="block",e.innerHTML="All fields must be filled in.",console.log("All fields must be filled in.");return}if(n.value.length<9){e.innerHTML="The password must contain more than 9 characters.",e.style.display="block",console.log("The password must contain more than 9 characters.");return}if(n.value.length>20){e.innerHTML="The password must contain less than 20 characters.",e.style.display="block",console.log("The password must contain less than 20 characters.");return}if(!t.value.includes("@stud.noroff.no")){e.innerHTML="The email must end with @stud.noroff.no.",e.style.display="block",console.log("The email must end with @stud.noroff.no.");return}if(!/^[a-zA-Z0-9]+$/.test(r.value)){e.innerHTML="The username must only contain letters and numbers.",e.style.display="block",console.log("The username must only contain letters and numbers.");return}const u={name:r.value,email:t.value,bio:"Default bio",avatar:{url:"https://github.com/elanetto/FED1-PE1-elanetto/blob/main/assets/images/user/avatar-user-default.png?raw=true",alt:"User  Avatar"},banner:{url:"https://github.com/elanetto/FED1-PE1-elanetto/blob/main/assets/images/200kb-images/kewater_view-01.jpg?raw=true",alt:"User  Banner"},venueManager:!0,password:n.value};try{const c=await(await fetch(T,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)})).json();if(console.log(c),c.errors){console.log(c.errors),e.style.display="block",e.innerHTML=c.errors.map(i=>i.message).join("<br>"),console.log(c.errors);return}c.email&&(localStorage.setItem("username",c.name),localStorage.setItem("email",c.email),localStorage.setItem("avatar",c.avatar.url),localStorage.setItem("banner",c.banner.url),s.style.display="block",console.log("User registered successfully."),setTimeout(()=>{window.location.href="account/login/"},3e3))}catch(d){console.log(d),e.style.display="block",e.innerHTML="Something went wrong. Please try again."}document.querySelector(".register-form").reset()})}function B(){const{email:r,password:t,showPasswordBtn:n,errorMessage:o,loginBtn:e}=v();if(!r||!e||!o||!t||!n)return;const s=n.querySelector(".fa-eye-slash"),a=n.querySelector(".fa-eye");if(!s||!a)return;function l(){t.type==="password"?(s.classList.add("hide"),a.classList.remove("hide")):(s.classList.remove("hide"),a.classList.add("hide"))}l(),n.removeEventListener("click",p),n.addEventListener("click",p),e.addEventListener("click",async function(u){var g,w;u.preventDefault();const d=r.value.trim(),c=t.value.trim();if(!A(d)){o.textContent="Email not valid",o.style.display="block";return}if(c.length===0){o.textContent="Please enter a password",o.style.display="block";return}const i={email:d,password:c};try{const f=await fetch(S,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),m=await f.json();if(f.ok)localStorage.setItem("username",m.data.name),localStorage.setItem("email",m.data.email),localStorage.setItem("avatar",m.data.avatar.url),localStorage.setItem("banner",m.data.banner.url),localStorage.setItem("token",m.data.accessToken),window.location.href="../../account/myaccount/";else{const k=((w=(g=m.errors)==null?void 0:g[0])==null?void 0:w.message)||"An error occurred during login.";o.textContent=k,o.style.display="block"}}catch{o.textContent="An error occurred with your login request.",o.style.display="block"}})}function A(r){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)}function L(){const r=localStorage.getItem("username"),t=localStorage.getItem("email"),n=localStorage.getItem("avatar"),o=localStorage.getItem("banner"),e=document.querySelector(".username-from-local-storage");r&&e&&(e.textContent=r);const s=document.querySelector(".email-from-local-storage");t&&s&&(s.textContent=t);const a=document.querySelector(".avatar-from-local-storage");n&&a&&(a.style.backgroundImage=`url(${n})`,a.style.backgroundSize="cover",a.style.backgroundPosition="center");const l=document.querySelector(".banner-from-local-storage");o&&l&&(l.style.backgroundImage=`url(${o})`,l.style.backgroundSize="cover",l.style.backgroundPosition="center")}function y(){const r=localStorage.getItem("token");if(!r){console.error("No token found");return}const t=r.replace(/['"]+/g,""),n=new Headers;return n.append("Authorization",`Bearer ${t}`),fetch("https://v2.api.noroff.dev/auth/create-api-key",{method:"POST",headers:n,redirect:"follow"}).then(e=>{if(!e.ok)throw new Error(`API key request failed: ${e.status} ${e.statusText}`);return e.json()}).then(e=>{var a;const s=(a=e==null?void 0:e.data)==null?void 0:a.key;if(!s)throw new Error("API key not found in response");return localStorage.setItem("api_key",s),s}).catch(e=>(console.error("Error fetching API key:",e),null))}function h(){const r=localStorage.getItem("token"),t=localStorage.getItem("username");if(!r)return null;const n=r.replace(/['"]+/g,"");if(!t)return null;const o=t.replace(/['"]+/g,"");return{cleanedToken:n,cleanedUsername:o}}function q(){const r=h();if(!r){console.warn("Token details are not available. Skipping profile picture setup.");return}const{cleanedToken:t,cleanedUsername:n}=r,o=document.getElementById("avatar-input"),e=document.getElementById("change-avatar-button");if(!o||!e){console.warn("Profile picture input or button not found. Skipping setup.");return}e.addEventListener("click",async s=>{s.preventDefault();const a=o.value.trim();if(!a||!U(a)){alert("Please enter a valid URL.");return}try{const l=await y();if(!l){alert("Unable to fetch API key.");return}const u=new Headers;u.append("Content-Type","application/json"),u.append("X-Noroff-API-Key",l),u.append("Authorization",`Bearer ${t}`);const d=JSON.stringify({avatar:{url:a,alt:"Avatar"}}),c={method:"PUT",headers:u,body:d,redirect:"follow"},i=await fetch(`https://v2.api.noroff.dev/social/profiles/${n}`,c);if(!i.ok)throw console.error("Request failed:",i.status,i.statusText),new Error(`Failed to update profile picture: ${i.status} ${i.statusText}`);const g=await i.json();localStorage.setItem("avatar",a),alert("Your profile picture has been updated!"),location.reload()}catch(l){console.error("An error occurred while updating the profile picture:",l),alert("An error occurred while updating your profile picture.")}})}function U(r){try{return new URL(r),!0}catch{return!1}}function $(){const r=h();if(!r){console.error("Failed to fetch token details.");return}const{cleanedToken:t,cleanedUsername:n}=r;if(!t||!n){console.error("Token or username is missing.");return}const o=document.getElementById("banner-input"),e=document.getElementById("change-banner-button");if(!o||!e){console.error("Required input or button elements are missing.");return}e.addEventListener("click",async s=>{s.preventDefault();const a=o.value.trim();if(!a||!H(a)){alert("Please enter a valid URL."),console.error("Invalid or empty URL:",a);return}try{const l=await y();if(!l){console.error("Failed to fetch API key."),alert("Unable to fetch API key.");return}const u=new Headers;u.append("Content-Type","application/json"),u.append("X-Noroff-API-Key",l),u.append("Authorization",`Bearer ${t}`);const d=JSON.stringify({avatar:{url:a,alt:"Avatar"}}),c={method:"PUT",headers:u,body:d,redirect:"follow"},i=await fetch(`https://v2.api.noroff.dev/social/profiles/${n}`,c);if(!i.ok)throw console.error("Request failed:",i.status,i.statusText),new Error(`Failed to update profile picture: ${i.status} ${i.statusText}`);const g=await i.json();localStorage.setItem("banner",a),alert("Your profile banner has been updated!"),location.reload()}catch(l){console.error("Error updating profile banner:",l),alert("An error occurred while updating your banner.")}})}function H(r){try{return new URL(r),!0}catch{return!1}}const M=()=>{if(document.body.classList.contains("my-account-page")){if(!sessionStorage.getItem("myAccountReloaded")){sessionStorage.setItem("myAccountReloaded","true"),location.reload();return}document.getElementById("avatar-input")&&document.getElementById("change-avatar-button")&&q(),document.getElementById("banner-input")&&document.getElementById("change-banner-button")&&$()}};document.addEventListener("DOMContentLoaded",function(){v(),B(),L(),h(),M(),y(),(document.getElementById("register-form")?I():null)&&P();const t=localStorage.getItem("username");if(!t)return;const n=t.replace(/['"]+/g,""),o=document.querySelector(".logged-in-username");o&&(o.textContent=`Hello, ${n}! You are currently logged in.`),document.querySelectorAll(".visible-if-logged-in").forEach(s=>{s&&(s.style.display="block")})});
