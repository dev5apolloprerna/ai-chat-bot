(function () { console.log("Widget started"); // ✅ safer way (NO currentScript) 
const script = document.querySelector('script[data-company-id]'); if (!script) { console.error("Script tag not found"); return; } 
const companyId = script.getAttribute("data-company-id"); 
if (!companyId) { console.error("No company ID"); return; } 
 const button = document.createElement("button"); 
 button.innerText = "💬"; 
 button.style.position = "fixed"; 
 button.style.bottom = "10px"; 
 button.style.right = "20px"; 
 button.style.zIndex = "9999"; 
 button.style.padding = "19px"; 
 button.style.borderRadius = "50%"; 
 button.style.background = "#6366f1"; 
 button.style.color = "white"; 
 button.style.border = "none"; 
 button.style.cursor = "pointer"; 
 document.body.appendChild(button); 
 const iframe = document.createElement("iframe"); 
 iframe.src = `https://salexo.co.in/chat?company=${companyId}`; 
 iframe.style.position = "fixed"; 
 iframe.style.bottom = "30px"; 
 iframe.style.right = "80px"; 
 iframe.style.width = "500px"; 
 iframe.style.height = "600px"; 
 iframe.style.border = "none"; 
 iframe.style.borderRadius = "12px"; 
 iframe.style.display = "none"; 
 iframe.style.zIndex = "9999"; 
 document.body.appendChild(iframe); 
 button.onclick = () => { 
  iframe.style.display = iframe.style.display === "none" ? "block" : "none"; }; })(); 


// (function () {
//   console.log("Widget started");

//   // 🔹 Get script tag
//   const script = document.querySelector('script[data-company-id]');

//   if (!script) {
//     console.error("Script tag not found");
//     return;
//   }

//   const companyId = script.getAttribute("data-company-id");

//   if (!companyId) {
//     console.error("No company ID");
//     return;
//   }

//   // 🔹 Create button
//   const button = document.createElement("button");
//   button.innerText = "💬";
//   button.style.position = "fixed";
//   button.style.bottom = "20px";
//   button.style.right = "20px";
//   button.style.zIndex = "9999";
//   button.style.padding = "16px";
//   button.style.borderRadius = "50%";
//   button.style.background = "#6366f1";
//   button.style.color = "white";
//   button.style.border = "none";
//   button.style.cursor = "pointer";
//   button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

//   document.body.appendChild(button);

//   // 🔹 Create iframe
//   const iframe = document.createElement("iframe");
//   iframe.src = `http://localhost:5173/chat?company=${companyId}`;
//   iframe.style.position = "fixed";
//   iframe.style.border = "none";
//   iframe.style.display = "none";
//   iframe.style.zIndex = "9999";
//   iframe.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";

//   document.body.appendChild(iframe);

//   // 🔥 Responsive function
//   const setResponsiveStyles = () => {
//     const isMobile = window.innerWidth < 768;

//     if (isMobile) {
//       // 📱 Mobile → Fullscreen
//       iframe.style.bottom = "0";
//       iframe.style.right = "0";
//       iframe.style.width = "100vw";
//       iframe.style.height = "100vh";
//       iframe.style.borderRadius = "0";
//     } else {
//       // 💻 Desktop → Floating box
//       iframe.style.bottom = "80px";
//       iframe.style.right = "20px";
//       iframe.style.width = "90vw";
//       iframe.style.maxWidth = "400px";
//       iframe.style.height = "70vh";
//       iframe.style.maxHeight = "600px";
//       iframe.style.borderRadius = "12px";
//     }
//   };

//   // 🔹 Initialize responsive styles
//   setResponsiveStyles();

//   // 🔹 Update on resize
//   window.addEventListener("resize", setResponsiveStyles);

//   // 🔹 Toggle chat
//   button.onclick = () => {
//     iframe.style.display =
//       iframe.style.display === "none" ? "block" : "none";
//   };

// })();

