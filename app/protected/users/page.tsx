"use client";

import React from "react";
import { Title, Text, Card } from "@tremor/react";
import Search from "@/components/Search";
import UserTable from "@/components/UserTable";
import { useSession } from "next-auth/react";

function Users() {
  const { data: session } = useSession();

  if (session && session.user.role !== "admin") {
    return <div>Not authorized</div>;
  }
  const [searchTerm, setSearchTerm] = React.useState("");
  return (
    <div className="bg-white  w-full h-full">
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Title>
          <span className="text-black">Users</span>
        </Title>
        <Text>A table of users retrieved from our database.</Text>
        <Search setSearchTerm={setSearchTerm} />
        <Card className="mt-6">
          <UserTable searchTerm={searchTerm} />
        </Card>
      </main>
    </div>
  );
}
export default Users;
