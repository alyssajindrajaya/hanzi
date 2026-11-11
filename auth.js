import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore, doc, getDoc, setDoc} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
const config=window.HANZI_FIREBASE_CONFIG||{};
const configured=!!(config.apiKey&&!config.apiKey.startsWith('PASTE_')&&config.projectId&&!config.projectId.startsWith('PASTE_')&&config.appId&&!config.appId.startsWith('PASTE_'));
let auth,db,uid=null,saveQueue=Promise.resolve();
const status=(s)=>window.HANZI_APP?.status?.(s);
if(configured){
  try{
    const app=initializeApp(config);auth=getAuth(app);db=getFirestore(app);
    const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
    document.getElementById('googleLogin').onclick=async()=>{
      try{status('Opening Google sign-in…');await signInWithPopup(auth,provider)}catch(e){
        if(['auth/popup-blocked','auth/operation-not-supported-in-this-environment'].includes(e.code)){
          try{await signInWithRedirect(auth,provider)}catch(err){status('Sign-in failed: '+err.message)}
        }else status('Sign-in failed: '+e.message);
      }
    };
    getRedirectResult(auth).catch(e=>status('Google redirect failed: '+e.message));
    onAuthStateChanged(auth,async user=>{
      if(!user){uid=null;window.HANZI_APP?.signedOut?.();return}
      uid=user.uid;
      try{
        const snap=await getDoc(doc(db,'users',uid));
        await window.HANZI_APP?.signedIn?.({uid,name:user.displayName||user.email||'Learner',email:user.email||'',remote:snap.exists()?snap.data().state:null});
      }catch(e){status('Could not load cloud progress: '+e.message+' — local backup remains available.');await window.HANZI_APP?.signedIn?.({uid,name:user.displayName||user.email||'Learner',email:user.email||'',remote:null});}
    });
    window.HANZI_AUTH={configured:true,save:(userId,state)=>{
      // Serialize writes from this tab; later snapshots cannot overtake earlier ones.
      const snapshot=JSON.parse(JSON.stringify(state));
      saveQueue=saveQueue.catch(()=>{}).then(async()=>{
        if(auth.currentUser?.uid!==userId)throw Error('Not signed in');
        await setDoc(doc(db,'users',userId),{state:snapshot,updatedAt:new Date().toISOString()});
      });return saveQueue;
    },reload:async userId=>{if(auth.currentUser?.uid!==userId)throw Error('Not signed in');const s=await getDoc(doc(db,'users',userId));return s.exists()?s.data().state:null},logout:()=>signOut(auth)};
  }catch(e){status('Firebase initialization failed: '+e.message)}
}else{
  document.getElementById('googleLogin').disabled=true;
  document.getElementById('loginHelp').textContent='Firebase is not configured yet. Follow README.md to enable Google sign-in.';
}
