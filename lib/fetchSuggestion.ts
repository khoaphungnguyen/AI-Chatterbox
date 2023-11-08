import openai from "./chatGPT"

const fetchSuggestion = async ( model: string) => {
    try {
        const response = await openai.completions.create({
            model,
            prompt: "Give me a brief recommendation of no more than 20 words on a random topic that could intrigue and engage users.",
            max_tokens: 100,
            temperature: 0.8,
    
        })

        const message = response.choices[0].text;
        return message;
    } catch (error: unknown) {
        // Narrowing down the type of the error to an instance of Error
        if (error instanceof Error) {
            return `chatGPT was unable to find an answer for that! (Error:${error.message})`;
        } else {
            // Handle any other types or just re-throw
            return `chatGPT encountered an unknown error!`;
        }
    }
};

export default fetchSuggestion;