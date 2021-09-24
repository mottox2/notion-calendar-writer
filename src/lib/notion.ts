import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_KEY });

export const createCalendarItem = async (
  databaseId: string,
  title: string,
  start: string,
  end?: string
) => {
  const res = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
      Date: {
        type: "date",
        date: { start, end },
      },
    },
  });
  console.log(`Page is created: ${res.url}`);
};

export const getCalendarItems = async (
  databaseId: string,
  before: string,
  after: string
) => {
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Date",
      date: { before, after },
    },
  });

  console.log(`Result: ${res.results.length} items.`);
  return res.results;
};
