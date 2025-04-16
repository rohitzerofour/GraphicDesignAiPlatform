import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { replicate } from "@/lib/replicate";

const app = new Hono()
  .post(
    "/remove-bg",
    zValidator("json", z.object({ image: z.string() })),
    async (c) => {
      const { image } = c.req.valid("json");

      const output = (await replicate.run(
        "men1scus/birefnet:f74986db0355b58403ed20963af156525e2891ea3c2d499bfbfb2a28cd87c5d7",
        {
          input: {
            image: image,
          },
        }
      )) as {
        url: () => string;
      };

      return c.json({ data: output.url() });
    }
  )
  .post(
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
