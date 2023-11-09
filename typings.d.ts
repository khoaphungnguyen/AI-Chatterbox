interface Message{
    "content": string,
    "createAt": admin.firestore.Timestamp;
    "user": {
        "_id": string;
        "name": string;
        "avatar": string;
        "role": string;
    };
}

interface ChatCompletionMessageParam{
    "role": string;
    "content": string;
  };


type FetcherParams = [string, string];