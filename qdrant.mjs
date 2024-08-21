
import { QdrantClient } from '@qdrant/js-client-rest';
import { embed } from './gpt.mjs';
import { createRequire } from "module";
import { randomUUID } from 'crypto';
const require = createRequire(import.meta.url);
const uuid = require('uuid');

const qdrant_key = 'ytUrMAOUBVAzo7Aa_tHI1Om6sZfPPgyFa40QjZqIBbyf10cOzOKAuQ';
//const qdrant = new Qdrant("https://2f4d7776-487e-47e1-8299-e0e18bc491dd.us-east-1-0.aws.cloud.qdrant.io:6333");

const client = new QdrantClient({
    url: 'https://2f4d7776-487e-47e1-8299-e0e18bc491dd.us-east-1-0.aws.cloud.qdrant.io:6333',
    apiKey: 'ytUrMAOUBVAzo7Aa_tHI1Om6sZfPPgyFa40QjZqIBbyf10cOzOKAuQ',
});

// JavaScript source code
const create_coll = async (collectionName) => {
    await client.createCollection(collectionName, {
        vectors: {
            size: 1536,
            distance: 'Cosine',
        },
        optimizers_config: {
            default_segment_number: 2,
        },
        replication_factor: 2,
    });
}

const delete_coll = async (collectionName) => {

    await client.deleteCollection(collectionName);
}

const get_coll = async () => {
    const response = await client.getCollections();
    console.log(response);
}

const add = async (em) => {
    console.log(em);
    try {
        await client.upsert("embeddings", {
            wait: true,
            points: [
                {
                    id: 7,
                    vector:em,
                    payload: {
                        argomento: "Elettronica"
                    },

                }
            ]
        })
    }
    catch(error) {
        console.log(error);
    }
}

const retrieve = async () => {
    const points = await client.retrieve("embeddings", 

    );
    
    return points;
}

const research = async(em,limit,collection) => {
    const res1 = await client.search(collection, {
        vector: em,
        limit: limit,
    });

    return res1;
}

const add_user = async(nome, cognome,descrizione,email, des)=>{

    try {
        
        await client.upsert("embeddings", {
            wait: true,
            points: [
                {
                    id: randomUUID(),
                    vector: des,
                    payload: {
                        nome: nome,
                        cognome: cognome,
                        descrizione: descrizione,
                        email:email
                    },

                }
            ]
        })
    }
    catch (error) {
        console.log(error);
    }

}

const add_guide = async (titolo, autore, testo, des)=>{

    try {

        await client.upsert("Tutorial", {
            wait: true,
            points: [
                {
                    id: randomUUID(),
                    vector: des,
                    payload: {
                        titolo:titolo,
                        autore:autore,
                        testo: testo,
                        likes: [],
                        comments:[]
                    },

                }
            ]
        })
    }
    catch (error) {
        console.log(error);
    }

}

const add_request = async(richiesta,des) => {
    try {

        await client.upsert("Richieste", {
            wait: true,
            points: [
                {
                    id: randomUUID(),
                    vector: des,
                    payload: {
                        richiesta:richiesta
                    },

                }
            ]
        })
    }
    catch (error) {
        console.log(error);
    }

}

const retrieveAuthor = async (email) => {
    try {
        const res2 = await client.search("embeddings", {
            
            
            filter: {
                must: [
                    {
                        key: 'email',
                        match: {
                            value: email,
                        },
                    },
                ],
        },
            with_payload: true,
            with_vector: false,
            limit: 5
        }
        )}
        catch (error) { console.log(error) };
}

const retrieveGuide = async (email) => {
    try {
        const res2 = await client.search("Tutorial", {
            
            limit: 10,
            with_payload: true,
            with_vector: false,
            filter: {
                must: [
                    {
                        key: 'email',
                        match: {
                            value: email,
                        },
                    },
                ],
            },
        }
        )
    }
    catch (error) { console.log(error) };
}

const update = async (collectionName, id, payload) => {

    const updateResult = client.update(collectionName,{ ids:id, payload: payload })
}



export { update,add, add_guide,add_request, add_user , create_coll,delete_coll,  get_coll,client, retrieve, retrieveAuthor,retrieveGuide, research } ;