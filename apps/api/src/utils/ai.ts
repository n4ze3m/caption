import { ChatPromptTemplate } from "langchain/prompts";
import { ChatFireworks } from "langchain/chat_models/fireworks";
import { HumanMessage } from "langchain/schema";

const SOCIAL_MEDIA_PROPMPT = {
  facebook: `You are a facebook post generator. Your task is generate a new post from the provided image. Use the following instructions to generate the post.

Your post should be:

- Suitable for Facebook 
- Must be like a facebook user would write it
- Don't make it too long
- Only generate post based on the image provided as an inspiration
- Only return the post text
- Don't include word facebook in the post

    `,
  twitter: `You are a tweet generator. Your task is generate a new tweet from the provided image. Use the following instructions to generate the tweet.
     
Your tweet should be:

- Suitable for Twitter
- Must be like a twitter user would write it
- Don't make it too long
- Only generate post based on the image provided as an inspiration
- Only return the tweet text
- Don't include word twitter in the tweet
    `,

  instagram: `You are a instagram caption generator. Your task is generate a new caption from the provided image. Use the following instructions to generate the caption.

Your caption should be:

- Suitable for Instagram
- Must be like a instagram user would write it
- Don't make it too long
- Only generate post based on the image provided as an inspiration
- Only return the caption text
- Don't include word instagram in the caption
    `,

  linkedin: `You are a linkedin post generator. Your task is generate a new post from the provided image. Use the following instructions to generate the post.
     
Your post should be:

- Suitable for LinkedIn
- Must be a professional post
- Only include emojis if it is required
- Must be like a linkedin user would write it
- Don't make it too long
- Only generate post from image provided as an inspiration
- Only generate post based on the image provided
- Only return the post text
    
    `,
};

type GenerateCaptionOptions = {
  socialMedia: "facebook" | "twitter" | "instagram" | "linkedin";
  imageBase64: string;
};

export const generateCaption = async (options: GenerateCaptionOptions) => {
  const { socialMedia, imageBase64 } = options;

  let imageBase64WithHeader = `data:image/jpeg;base64,${
    imageBase64.split(",")[1]
  }`;

  const human = new HumanMessage({
    content: [
      {
        text: SOCIAL_MEDIA_PROPMPT[socialMedia],
        type: "text",
      },
      {
        image_url: {
          url: imageBase64WithHeader,
        },
        type: "image_url",
      },
    ],
  });

  console.log("human", human);

  const chatPrompt = ChatPromptTemplate.fromMessages([human]);

  const prompt = await chatPrompt.formatMessages({});

  const fireworks = new ChatFireworks({
    modelName: "accounts/fireworks/models/llava-v15-13b",
  });

  console.log("prompt", prompt);
  const response = await fireworks.call(prompt);

  return response;
};
