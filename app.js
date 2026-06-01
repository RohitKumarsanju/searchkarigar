import {
getFirestore,
doc,
setDoc,
getDoc,
addDoc,
collection,
query,
orderBy,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
getFirestore,
doc,
setDoc
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

const name =
document.getElementById("regName").value;

const mobile =
document.getElementById("regMobile").value;

const email =
document.getElementById("regEmail").value;

const password =
document.getElementById("regPassword").value;

const userType =
document.getElementById("regUserType").value;

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
name:name,
mobile:mobile,
email:email,
userType:userType,
createdAt:new Date().toISOString()
}
);

alert("Account Created Successfully");

}
catch(error){

alert(error.message);

}

});

}

/* LOGIN */

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

loginBtn.addEventListener("click",async()=>{

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

if(email==="bigrushcom@gmail.com"){

alert("Admin Login Detected");

}

}
catch(error){

alert(error.message);

}

});

  }
/* POST SYSTEM */

const postBtn = document.getElementById("postBtn");

if(postBtn){

postBtn.addEventListener("click", async ()=>{

const user = auth.currentUser;

if(!user){
alert("Pehle Login Karo");
return;
}

const postText =
document.getElementById("postText").value;

if(!postText){
alert("Post likho");
return;
}

try{

const userDoc =
await getDoc(doc(db,"users",user.uid));

const userData =
userDoc.data();

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

}
catch(error){

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

const q =
query(
collection(db,"posts"),
orderBy("createdAt","desc")
);

const snapshot =
await getDocs(q);

snapshot.forEach((docSnap)=>{

const post =
docSnap.data();

container.innerHTML += `

<div class="post">

<div class="post-user">
${post.userName}
</div>

<div class="post-type">
${post.userType}
</div>

<div>
${post.postText}
</div>

</div>

`;

});

}

loadPosts();
