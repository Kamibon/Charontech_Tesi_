// JavaScript source code

import {
    getAuth
} from 'firebase/auth'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");

const cors = require('cors');



import { addAuthors, addComment, addGuide, addLike, addSuggest, changeEmail, fb_app, fetchGuide, getAuthors, getComments, getGuides, getLikes, getSuggestions, register,remove,removeLike,updateAuthor,updateGuide } from './tesi/src/firebase.mjs'
import {add_guide,add_request,get_coll,client, add, create_coll, retrieve,retrieveAuthor,retrieveGuide, research, add_user } from './qdrant.mjs';
import { embed, ask, moderate, create_image, explain } from './gpt.mjs';
import * as session from "express-session";


const auth = getAuth(fb_app)
const PORT = process.env.PORT || 4200;

const app = express();
app.use(cors());
app.use(express.json());

/*app.use(session({
    secret:"thisisasecretnobodyhastoknow",
    cookie: {
        sameSite:'strict'
    }
}))*/


app.get("/api/:q", (req, res) => {

    ask(req.params.q).then((result) => res.json({ message:result }));
    
});



app.post("/api/explain", (req, res) => {

    explain(req.body.text, req.body.piece ).then((result) => res.json({ message: result }));
});

app.get("/api/find/:q", (req, res) => {
   
    embed(req.params.q).then((emb) => research(emb, 9, "Tutorial")).then((result) => fetchGuide(fb_app, result)).then((results) => res.json({ message: results }))
    
    
   

});

app.post("/api/writers/reg", (req, res) => {
    
    register(auth, req.body.loginEmail, req.body.password);
        
        embed(req.body.descrizione).then((result) => add_user(req.body.nome, req.body.cognome, req.body.descrizione, req.body.loginEmail, result));
    addAuthors(fb_app,req.body);
    
});

app.post("/api/guides/add", (req, res) => {

    

    embed(req.body.testo).then((result) => add_guide(req.body.titolo, req.body.autore, req.body.testo, result));
    addGuide(fb_app, req.body.titolo, req.body.testo, req.body.autore)
});

app.get("/api/guides/comment/get/:q1&:q2", (req, res) => {

    getComments(fb_app, req.params.q1, req.params.q2).then((result) => res.json({ message: result }));


});

app.post("/api/guides/comments", (req, res) => {

    addComment(fb_app, req.body);


});


app.post("/api/guides/like", (req, res) => {

    addLike(fb_app, req.body);

    
});

app.get("/api/guides/like/get/:q1&:q2", (req, res) => {
    getLikes(fb_app, req.params.q1, req.params.q2).then((result) => res.json({message:result}));
})

app.get("/api/guides/like/remove/:user&:autore&:titolo", (req, res) => {
    removeLike(fb_app, req.params.user, req.params.autore, req.params.titolo);

});

app.post("/api/guides/update", (req, res) => {
    
    updateGuide(fb_app, req.body);
}

)

app.get("/api/moderate/:q", (req, res) => {
    moderate(req.params.q).then((result) => res.json({ ris: result }));
});

app.get("/api/requests/:q", (req, res) => {
    
    embed(req.params.q).then((des) => add_request(req.params.q, des));
});

app.get("/api/requests/get/:q", (req, res) => {
    embed(req.params.q).then((emb) => research(emb, 6, "Richieste")).then((result) => res.json({ message: result }));
})

app.get("/api/writers/guides/:q", (req, res) => {

   getGuides(fb_app,req.params.q).then((result) => res.json({ message: result }));
})

app.get("/api/writers/suggestions/:q", (req, res) => {

    getSuggestions(fb_app, req.params.q).then((result) => res.json({ message: result }));
})

app.post("/api/writers/suggestions", (req, res) => {
   
    addSuggest(fb_app,  req.body);
})

app.get("/api/writers/suggestions/remove/:q1&:q2", (req, res) => {
    remove(fb_app, req.params.q1, req.params.q2);
})


app.get("/api/writers/data/:q", (req, res) => {
    
    getAuthors(fb_app,req.params.q).then((result) => res.json({ message: result }))
})

app.post("/api/writers/data/update", (req, res) => {
    updateAuthor(fb_app, req.body);
}
)

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

