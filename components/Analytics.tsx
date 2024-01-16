import React from "react";
import { Grid, Card, Title, Flex, Metric, Text, BarList } from "@tremor/react";
import Chart from "./Chart";
const chat = [
  { name: "/threads", value: 1230 },
  { name: "/threads/newthread", value: 751 },
  { name: "/threads/share", value: 471 },
];

const draw = [
  { name: "/draw", value: 453 },
  { name: "/draw/code", value: 351 },
  { name: "/draw/preview", value: 271 },
];

const todo = [
  { name: "/todo", value: 789 },
  { name: "/todo/suggestion", value: 676 },
  { name: "/todo/share", value: 564 },
];
const calendar = [
  { name: "/calendar", value: 789 },
  { name: "/calendar/q", value: 676 },
  { name: "/calendar/share", value: 564 },
];

const data = [
  {
    category: "SmartChat",
    stat: "10,234",
    data: chat,
  },
  {
    category: "SmartDraw",
    stat: "12,543",
    data: draw,
  },
  {
    category: "SmartTodo",
    stat: "2,543",
    data: todo,
  },
  {
    category: "SmartCalendar",
    stat: "8,545",
    data: calendar,
  },
];

function Analytics() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        {data.map((item) => (
          <Card key={item.category}>
            <Title>{item.category}</Title>
            <Flex
              justifyContent="start"
              alignItems="baseline"
              className="space-x-2"
            >
              <Metric>{item.stat}</Metric>
              <Text>Total View</Text>
            </Flex>
            <Flex className="mt-5">
              <Text>Pages</Text>
              <Text className="text-right">Views</Text>
            </Flex>
            <BarList
              valueFormatter={(number: number) => {
                return Intl.NumberFormat("us").format(number).toString();
              }}
              data={item.data}
              className="mt-2"
            />
          </Card>
        ))}
      </Grid>
      <Chart />
    </main>
  );
}

export default Analytics;
