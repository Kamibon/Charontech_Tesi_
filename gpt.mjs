import { Configuration, OpenAIApi } from 'openai';
const api = 'sk-chiaveapi';
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
        console.log(completion.data)
        return(completion.data.choices[0].message);
    }
    catch (error) {
        console.log(error);
    }
}

const explain = async (text, piece) => {
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user", content: "Dato questo testo compreso tra underscore:_" + text + "_, rintraccia all interno di questo testo questa frase, compresa tra underscore:_" + piece +"_, fatto ciò voglio che mi crei una frase che spieghi meglio il significato della frase data, e allo stesso tempo sia perfettamente inseribile nel testo che ti ho dato. Voglio che tu restituisca solo la nuova frase  " 
            }],
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
        console.log(response);
        const arr = response.data.results[0].category_scores;
        
        for (let el in arr) {
            
            if (arr[el] > 0.6)
                return false;
        }
        
        
        return true;
        
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
