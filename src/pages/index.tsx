import {
  DatePropertyValue,
  Page,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../styles/Home.module.css";

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const Home: NextPage = () => {
  const [range, setRange] = useState({
    start: "",
    end: "",
  });
  const [items, setItems] = useState<Page[]>([]);
  const [itemByDate, setItemByDate] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetch("/api/get-items").then((res) => {
      res.json().then((value) => {
        setItems(value.items);
      });
    });
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    let itemByDates: Record<string, RichText[]> = {};
    items.forEach((item) => {
      const { title } = item.properties["Name"] as TitlePropertyValue;
      const { date } = item.properties["Date"] as DatePropertyValue;
      if (!date) return;
      console.log({ title, date });
      itemByDates[date.start] = itemByDates[date.start]
        ? [...itemByDates[date.start], title[0]]
        : [title[0]];
    });
    setItemByDate(itemByDates);
    console.log(itemByDates);
  }, [items]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Calendar
        onChange={(value: Date[]) => {
          const [start, end] = value;
          setRange({
            start: formatDate(start),
            end: formatDate(end),
          });
          console.log({ start, end });
        }}
        // formatDay={(_locale, d) => {
        //   return formatDate(d);
        // }}
        tileContent={({ activeStartDate, date }) => {
          const day = new Date(date).toISOString().split("T")[0];
          const items = itemByDate[day];
          console.log(day, items);
          if (!items) return;
          return (
            <div>
              {items.map((title) => {
                if (!title) return <p>untitled</p>;
                return <p>{title.plain_text}</p>;
                return <p>{JSON.stringify(title, null, 2)}</p>;
              })}
            </div>
          );
          return date.getDay() === 0 ? (
            <p className={styles.cell}>It's Sunday!</p>
          ) : (
            <p className={styles.cell}></p>
          );
        }}
        selectRange={true}
        minDetail="month"
        value={range.start && [new Date(range.start), new Date(range.end)]}
      />
      {JSON.stringify(range, null, 2)}
      {range.start} - {range.end}
    </div>
  );
};

export default Home;
