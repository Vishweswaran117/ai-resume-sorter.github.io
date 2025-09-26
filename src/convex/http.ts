import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/upload_file",
  method: "POST",
  handler: httpAction(async (ctx) => {
    const url = await ctx.storage.generateUploadUrl();
    return new Response(JSON.stringify({ uploadUrl: url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

export default http;