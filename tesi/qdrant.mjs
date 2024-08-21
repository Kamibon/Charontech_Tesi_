import { QdrantClient } from '@qdrant/js-client-rest';


const qdrant_key = 'ytUrMAOUBVAzo7Aa_tHI1Om6sZfPPgyFa40QjZqIBbyf10cOzOKAuQ';
const client = new QdrantClient({
    url: 'https://2f4d7776-487e-47e1-8299-e0e18bc491dd.us-east-1-0.aws.cloud.qdrant.io:6333',
    apiKey: 'ytUrMAOUBVAzo7Aa_tHI1Om6sZfPPgyFa40QjZqIBbyf10cOzOKAuQ',
});
// JavaScript source code
const create_coll = async (collectionName) => {
    await client.createCollection(collectionName, {
        vectors: {
            size: 2,
            distance: 'Cosine',
        },
        optimizers_config: {
            default_segment_number: 2,
        },
        replication_factor: 2,
    });
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
                    id: 3,
                    vector: em,
                    payload: {
                        city: 'Berlin',
                        country: 'Germany',
                        count: 1000000,
                        square: 12.5,
                        coords: { lat: 1.0, lon: 2.0 },
                    },

                }
            ]
        })
    }
    catch (error) {
        console.log(error);
    }
}
export { create_coll, add, get_coll, client };