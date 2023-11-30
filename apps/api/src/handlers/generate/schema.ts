import { FastifySchema } from "fastify";

export const generateSocialMediaCaptionSchema: FastifySchema = {
  body: {
    type: "object", 
    properties: {
      social_media: {
        type: "string",
        enum: ["twitter", "instagram", "facebook", "linkedin"],
      },
      image_base64: {
        type: "string",
      },
    },
    required: ["social_media", "image_base64"],
  },
};
