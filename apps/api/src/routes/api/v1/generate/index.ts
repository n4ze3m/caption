import { FastifyPluginAsync } from "fastify";
import { generateSocialMediaCaptionSchema } from "../../../../handlers/generate/schema.js";
import { generateSocialMediaCaption } from "../../../../handlers/generate/post.handler.js";

const generate: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: generateSocialMediaCaptionSchema,
      bodyLimit: 50 * 1024 * 1024,
    },
    generateSocialMediaCaption
  );
};

export default generate;
