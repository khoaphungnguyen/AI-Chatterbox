import { auth } from "@/auth";

export default async function Main() {
  const session = await auth();
  const user = await session?.user;

  return <div></div>;
}
