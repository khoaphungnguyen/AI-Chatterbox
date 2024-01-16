import React from "react";
import { Title, Text, Card } from "@tremor/react";
import Search from "@/components/Search";
import UserTable from "@/components/UserTable";
function Users() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>A table of users retrieved from our Postgres database.</Text>
      <Search />
      <Card className="mt-6">
        <UserTable  />
      </Card>
    </main>
  );
}
export default Users;
