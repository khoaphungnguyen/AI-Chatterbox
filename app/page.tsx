import { auth } from "@/auth";
import Home from "@/components/Home";
import { redirect } from "next/navigation";

export default async function Main() {
  const session = await auth();
  const user = await session?.user;
  if (user?.role === "admin"){
    redirect("/protected/users");
  }
  return (
    <div className="h-full w-full">
      <Home />
    </div>
  );
}
