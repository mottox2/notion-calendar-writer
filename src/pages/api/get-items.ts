// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Page } from "@notionhq/client/build/src/api-types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCalendarItems } from "../../lib/notion";

type Data = {
  items: Page[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const items = await getCalendarItems(
    process.env.NOTION_DATABASE_ID || "",
    "2021-10-10",
    "2021-09-10"
  );
  res.status(200).json({ items });
}
