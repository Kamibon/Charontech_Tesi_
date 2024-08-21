import { Configuration, OpenAIApi } from 'openai';
const api = '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';
const configuration = new Configuration({
    apiKey: api,
});
const openai = new OpenAIApi(configuration);


/*const embed = async (input) => {
    try {
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: input,

        });

        return await (response.data.data[0].embedding);
    }
    catch (error) {
        console.log(error);
    }


}*/

async function embed() {
    try {
        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: input,

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
        console.log(completion.data.choices[0].message);
    }
    catch (error) {
        console.log(error);
    }
}

export { embed, ask };