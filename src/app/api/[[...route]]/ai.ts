import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { replicate } from "@/lib/replicate";

const app = new Hono().post(
  "/generate-image",
  zValidator(
    "json",
    z.object({
      prompt: z.string(),
    })
  ),
  async (c) => {
    const { prompt } = c.req.valid("json");

    const input = {
      prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 4,
    };

    const output = (await replicate.run("black-forest-labs/flux-schnell", {
      input,
    })) as Array<{
      url: () => string;
    }>;

    return c.json({ data: output[0].url() });
  }
);

export default app;
