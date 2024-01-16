import React from "react";
import { auth } from "@/auth";
import Analytics from "@/components/Analytics";

async function AnalyticPage() {
  const session = auth();
  const role = await session.then((session) => session?.user.role);
  if (role !== "admin") {
    return <div>Not authorized</div>;
  }
  return (
    <div className="bg-gray-200">
      <Analytics />
    </div>
  );
}

export default AnalyticPage;
