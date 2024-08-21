import { Configuration, OpenAIApi } from 'openai';
const api = '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';
const configuration = new Configuration({
    apiKey: api,
});
const openai = new OpenAIApi(configuration);


const embed = async (inp) => {
    try {
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: inp,

        });

        return await (response.data.data[0].embedding);
    }
    catch (error) {
        console.log(error);
    }


}



const ask = async (content) => {
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: content }],
        });
        return(completion.data.choices[0].message);
    }
    catch (error) {
        console.log(error);
    }
}

const explain = async (content) => {
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content:"Mi riformuli in maniera più chiara questo testo:"+ content }],
        });
        return (completion.data.choices[0].message);
    }
    catch (error) {
        console.log(error);
    }

}

const moderate = async (inp) => {
    try {
        const response = await openai.createModeration({
            input: inp,
        });
        return response.data.results[0].category_scores;
    }
    catch (error) {
        console.log(error);
    }
}

const create_image = async (inp) => {
    try {
        const response = await openai.createImage({
            prompt: inp,
            n: 1,
            size: "256x256",
        });
        console.log(response.data.data[0].url)
        return(response.data.data[0].url)
    }
    catch (error) {

        console.log(error);
    }
}


export { embed, ask,moderate, create_image,explain };