import { FastifyRequest, FastifyReply } from "fastify";
import { generateCaption } from "../../utils/ai.js";

interface GenerateRequestBody {
  Body: {
    social_media: "twitter" | "instagram" | "facebook" | "linkedin";
    image_base64: string;
  };
}

export const generateSocialMediaCaption = async (
  request: FastifyRequest<GenerateRequestBody>,
  reply: FastifyReply
) => {
  try {
    const { social_media, image_base64 } = request.body;

    const response = await generateCaption({
      imageBase64: image_base64,
      socialMedia: social_media,
    });

    return {
      generated: response.content,
    };
  } catch (error: any) {
    return reply.status(500).send({
      error: error?.message || "Internal Server Error",
    });
  }
};
