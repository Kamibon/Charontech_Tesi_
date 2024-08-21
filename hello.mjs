// JavaScript source code



import {get_coll, add, create_coll, retrieve, retrieveAuthor, research, delete_coll,update } from './qdrant.mjs';
import { embed,ask, moderate, create_image} from './gpt.mjs';
import { Configuration, OpenAIApi } from 'openai';
import { changeEmail,fb_app, getDatabase,remove} from './tesi/src/firebase.mjs';
// client,

//QDRANT
//embed("Come aggiustare la lavatrice").then(add);

//embed("Ho lavorato in un negozio di elettrodomestici").then(research);
ask("Ehi,come stai?")
//moderate("Come tagliarsi le vene");
//embed("Faccio il pittore").then((res) => research(res, 5, "embeddings")).then((res) => console.log(res));
//embed("vasari@gmail.com").then((emb) => retrieveAuthor("vasari@gmail.com",emb)).then((res)=>console.log(res));
//FIREBASE
//const firestore = (getDatabase(app));
//AddDoc(firestore);
//GetDocs(fb_app);
//getRequests(fb_app)
//retrieveAuthor("provino@gmail.com")
//update("embedding", 7, {"argomento":"Automatica"})
//delete_coll("Richieste");
//create_coll("Richieste");
