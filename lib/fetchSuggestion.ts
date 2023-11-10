import openai from "./chatGPT"

const fetchSuggestion = async (model: string) => {
    const prompt= `"Provide four engaging recommendations (max 10 words each) as JSON: [{ "title": "", "content": "" }, ...]"`
    try {
        const response = await openai.chat.completions.create({
                model: model,
                messages: [{"role":"user", content: prompt}],
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                max_tokens: 1000,
                n: 1
        })
        const message = response.choices[0].message.content;
        return message;
    } catch (error: unknown) {
        // Narrowing down the type of the error to an instance of Error
        if (error instanceof Error) {
            return `SmartChat was unable to find an answer for that! (Error:${error.message})`;
        } else {
            // Handle any other types or just re-throw
            return `SmartChat encountered an unknown error!`;
        }
    }
};

export default fetchSuggestion;