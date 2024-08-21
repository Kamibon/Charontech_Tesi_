// JavaScript source code



import { get_coll, client, add, create_coll } from './qdrant.mjs';
import { embed, ask } from './gpt.mjs';
import { Configuration, OpenAIApi } from 'openai';

const api = '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';
const configuration = new Configuration({
    apiKey: api,
});
const openai = new OpenAIApi(configuration);




//embed("ciao").then(print);







function print(p) {

    console.log(p);
}





//create_coll("test");

embed("Ciao").then(add);
//get_coll();

const retrieve = async () => {
    const points = await client.retrieve("embeddings", { ids: [3] }

    );
    return points[0];
}

async () => {
    const res1 = await client.search(collectionName, {
        vector: queryVector,
        limit: 3,
    });

    console.log('search result: ', res1);
}
retrieve().then(print);
//ask("Come fare la pizza").then(print);