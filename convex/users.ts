import { query } from "./_generated/server";
import { auth } from "./auth";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await auth.getUserId(ctx);

    if (identity === null) {
      return null;
    }

    return await ctx.db.get(identity);
  },
});
