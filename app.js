import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
getFirestore,
doc,
setDoc,
getDoc,
addDoc,
collection,
query,
orderBy,
getDocs,
updateDoc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDQU49qoppo4GQqvnSCAgwiA7LJne8vFDw",
authDomain: "searchkarigar-da9c6.firebaseapp.com",
projectId: "searchkarigar-da9c6",
storageBucket: "searchkarigar-da9c6.firebasestorage.app",
messagingSenderId: "836531758694",
appId: "1:836531758694:web:33f2068d27b2ecbba86fa7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* REGISTER */

const registerBtn = document.getElementById("registerBtn");

if(registerBtn){

registerBtn.addEventListener("click", async ()=>{

const name = document.getElementById("regName").value;
const mobile = document.getElementById("regMobile").value;
const email = document.getElementById("regEmail").value;
const password = document.getElementById("regPassword").value;
const userType = document.getElementById("regUserType").value;

if(!name || !email || !password){
alert("Please fill all required fields");
return;
}

try{

const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);

const user = userCredential.user;

await setDoc(
doc(db,"users",user.uid),
{
name,
mobile,
email,
userType,
createdAt: Date.now()
}
);

alert("Account Created Successfully");

}catch(error){
alert(error.message);
}

});

}

/* LOGIN */

const loginBtn = document.getElementById("loginBtn");

if(loginBtn){

loginBtn.addEventListener("click", async()=>{

const email =
document.getElementById("loginEmail").value;

const password =
document.getElementById("loginPassword").value;

try{

await signInWithEmailAndPassword(
auth,
email,
password
);
alert("Login Successful");

console.log("login success");

document.getElementById("loginBox").classList.add("hidden");

document.getElementById("loginBox").classList.add("hidden");
document.getElementById("registerBox").classList.add("hidden");

}catch(error){
alert(error.message);
}

});

}

/* POST SYSTEM */

const postBtn = document.getElementById("postBtn");

if(postBtn){

postBtn.addEventListener("click", async()=>{

const user = auth.currentUser;

if(!user){
alert("Pehle Login Karo");
return;
}

const postText =
document.getElementById("postText").value.trim();

if(!postText){
alert("Post likho");
return;
}

try{

const userSnap =
await getDoc(doc(db,"users",user.uid));

if(!userSnap.exists()){
alert("User profile nahi mila");
return;
}

const userData = userSnap.data();

await addDoc(
collection(db,"posts"),
{
userId:user.uid,
userName:userData.name,
userType:userData.userType,
postText:postText,
createdAt:Date.now()
}
);

document.getElementById("postText").value="";

alert("Post Published");

loadPosts();

}catch(error){
alert(error.message);
}

});

}

/* LOAD POSTS */

async function loadPosts(){

const container =
document.getElementById("postsContainer");

if(!container) return;

container.innerHTML = "";

try{

const q = query(
collection(db,"posts"),
orderBy("createdAt","desc")
);

const snapshot = await getDocs(q);

snapshot.forEach((docSnap)=>{

const post = docSnap.data();

container.innerHTML += `
<div class="post">
<div class="post-user">${post.userName}</div>
<div class="post-type">${post.userType}</div>
<div>${post.postText}</div>
</div>
`;

});

}catch(error){

console.error(error);

}

}

loadPosts();
/* FOOTER SYSTEM */

async function loadFooter(){

try{

const footerDoc =
await getDoc(doc(db,"settings","footer"));

if(!footerDoc.exists()) return;

const data = footerDoc.data();

const footerText =
document.getElementById("footerText");

const footerBtn =
document.getElementById("footerBtn");

if(footerText){
footerText.innerText = data.text || "";
}

if(footerBtn){

footerBtn.onclick = ()=>{

if(data.link){
window.open(data.link,"_blank");
}

};

}

}catch(error){

console.log(error);

}

}

loadFooter();
/* USER STATUS */

onAuthStateChanged(auth, async(user)=>{

const authArea =
document.getElementById("authArea");

if(!authArea) return;

/* USER NOT LOGGED IN */

if(!user){

authArea.innerHTML = `
<button class="btn" onclick="showLogin()">
Login
</button>

<button class="btn" onclick="showRegister()">
Register
</button>
`;

return;

}

/* ADMIN FOOTER PANEL */

if(user.email === "bigrushcom@gmail.com"){

const panel =
document.getElementById("adminFooterPanel");

if(panel){

panel.classList.remove("hidden");

const footerDoc =
await getDoc(doc(db,"settings","footer"));

if(footerDoc.exists()){

const data = footerDoc.data();

document.getElementById("footerTextInput").value =
data.text || "";

document.getElementById("footerLinkInput").value =
data.link || "";

}

document.getElementById("saveFooterBtn").onclick =
async ()=>{

const newText =
document.getElementById("footerTextInput").value;

const newLink =
document.getElementById("footerLinkInput").value;

try{

await updateDoc(
doc(db,"settings","footer"),
{
text:newText,
link:newLink
}
);

alert("Footer Updated");

loadFooter();

}catch(error){

alert(error.message);

}

};

}

}

/* LOAD USER INFO */

const userSnap =
await getDoc(doc(db,"users",user.uid));

if(!userSnap.exists()) return;

const userData =
userSnap.data();

authArea.innerHTML = `
<span style="color:white;margin-right:10px;">
Welcome, ${userData.name}
</span>

<button id="logoutBtn" class="btn">
Logout
</button>
`;

const logoutBtn =
document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async()=>{

await signOut(auth);

location.reload();

});

});
});
