// JavaScript source code
import { initializeApp } from 'firebase/app'     //'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, updateEmail } from  'firebase/auth'          //'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';
import {doc, getFirestore, collection, deleteDoc, addDoc, getDocs,query,updateDoc,where } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUoFd7yOQ_-UdYtV5dAuHj3MjITFQG7rs",
    authDomain: "tmay-384013.firebaseapp.com",
    projectId: "tmay-384013",
    storageBucket: "tmay-384013.appspot.com",
    messagingSenderId: "677980957709",
    appId: "1:677980957709:web:81e16447f1d66540473944"
};

// Initialize Firebase
const fb_app = initializeApp(firebaseConfig);
const auth = getAuth(fb_app);




//Firestore
function getDatabase(app) {
    return getFirestore(app);
}



async function addAuthors(app, dati) {
    const db = getDatabase(app);


    try {
        const docRef = await addDoc(collection(db, "autori"), {
            Nome: dati.nome,
            Cognome: dati.cognome,
            Descrizione: dati.descrizione,
            loginEmail: dati.loginEmail
        });

        
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function addComment(app, dati) {
    const db = getDatabase(app)
    try {
        const docRef = await addDoc(collection(db, "commenti"), {
            autore: dati.autore,
            testo:dati.testo,
            titolo: dati.titolo,
            user:dati.user
        });

        
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}


async function addUser(app, email, username) {
    const db = getDatabase(app)
    try {
        const docRef = await addDoc(collection(db, "utenti"), {
            email: email,
            username:username
        });
        
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function addGuide(app, titolo,testo,autore) {
    const db = getDatabase(app)
    try {
        const docRef = await addDoc(collection(db, "Guide"), {
            titolo: titolo,
            testo: testo,
            autore:autore
        });

        
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

//Lavorazione
async function addLike(app,body) {
    const db = getDatabase(app)
    try {
        const docRef = await addDoc(collection(db, "likes"), {
            autore: body.autore,
            titolo:body.titolo,
            user: body.user

        });


    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


async function addSuggest(app, sug) {
    const db = getDatabase(app);
    
    
    try {
        const docRef = await addDoc(collection(db, "suggerimenti"), {
            user: sug.user,
            text: sug.text,
            sub: sug.sub,
            auth: sug.auth
        });

        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function changeEmail(user, newEmail) {
    
        updateEmail(user, newEmail).then(() => {
            console.log("Email cambiata in" + newEmail);
        }).catch((error) => {
            console.log(error);
        });
}

async function fetchGuide(app, lista) {
   const db = getDatabase(app);
    let results = [];
   
    for (let el of lista) {
        const q = await query(collection(db, "Guide"), where("autore", "==", el.payload.autore), where("titolo", "==", el.payload.titolo));
        const querySnapshot = await getDocs(q);
        

        querySnapshot.forEach((doc) => {
            results.push(doc.data());
            

        })
    }
   
    return results;

}



async function getAuthors(app, email) {
    const db = getDatabase(app);
    const q = await query(collection(db, "autori"), where("loginEmail", "==", email));
    const querySnapshot = await getDocs(q);
    let results = [];
    
    querySnapshot.forEach((doc) => {
        results.push(doc.data());


    })
    
    return results;

}

async function getComments(app, autore, titolo){
    const db = getDatabase(app);
    const q = await query(collection(db, "commenti"), where("autore", "==", autore), where("titolo", "==", titolo));
    const querySnapshot = await getDocs(q);
    let results = [];

    querySnapshot.forEach((doc) => {

        results.push(doc.data());


    })

    return results;
}

async function getUser(app, email) {
    
    const db = getDatabase(app);
    const q = await query(collection(db, "utenti"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    let results = [];

    querySnapshot.forEach((doc) => {

        results.push(doc.data());
       

    })
    
    return results[0].username;
}

async function getGuides(app,nome) {
    const db = getDatabase(app);
    const q = await query(collection(db, "Guide"), where("autore", "==", nome));
    const querySnapshot = await getDocs(q);
    let results = [];
    
    querySnapshot.forEach((doc) => {

        results.push(doc.data() );


    })
   
    return results;
}

async function getLikes(app, autore,titolo) {
   
    const db = getDatabase(app);
    const q = await query(collection(db, "likes"), where("autore", "==", autore), where("titolo","==", titolo ));
    const querySnapshot = await getDocs(q);
    let results = [];
   
    querySnapshot.forEach((doc) => {
        results.push(doc.data());


    })
    return results;
}



async function getSuggestions(app, em) {
    const db = getDatabase(app);
    const q = await query(collection(db, "suggerimenti"), where("auth", "==", em));
    const querySnapshot = await getDocs(q);
    let results = [];
    let i = 0;
    querySnapshot.forEach((doc) => {
        results.push(doc.data());
        
        
    })
    return results;
}


const remove = async (app, user, sub) => {
    const db = getDatabase(app);
    const q = await query(collection(db, "suggerimenti"), where("user", "==", user), where("sub", "==", sub));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docu) => {
        
        const id = docu.id;
        
         await deleteDoc(doc(db, "suggerimenti", id));

    })
   
    
    
    
}

const removeLike = async (app, user, autore, titolo) => {
    const db = getDatabase(app);
    const q = await query(collection(db, "likes"), where("user", "==", user), where("autore", "==", autore), where("titolo", "==", titolo));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docu) => {

        const id = docu.id;
        
        await deleteDoc(doc(db, "likes", id));

    })
}



const updateAuthor = async (app,body)=>{
    const db = getDatabase(app);
    const q = await query(collection(db, "autori"), where("loginEmail", "==", body.loginEmail));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docu) => {

        const id = docu.id;
        switch (body.campo) {
            case "email": {
                await updateDoc(doc(db, "autori", id), { loginEmail: body.valore });
                
                
                break
            }
            case "Descrizione": await updateDoc(doc(db, "autori", id), { Descrizione: body.valore });
    }
    })
}

const updateGuide = async (app, body) => {
    
    const db = getDatabase(app);
    const q = await query(collection(db, "Guide"), where("titolo", "==", body.titolo),where("autore", "==", body.autore) );
    //, 
    //
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docu) => {

        const id = docu.id;
       
             await updateDoc(doc(db, "Guide", id), { testo: body.testo }); 
            
        
    })


}


//Autenticazione
const register = async (auth, email,password) => {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        
    }
    catch (error) {
        console.log(error);
    }
}



const logout = async () => {
   
    signOut(auth);

}

export { addAuthors,addComment,addGuide,addLike, addSuggest, auth, changeEmail, fb_app, fetchGuide,getAuthors, getComments, getDatabase, getGuides, getLikes, getSuggestions,logout, remove, removeLike, updateAuthor,updateGuide, addUser, getUser,  register }