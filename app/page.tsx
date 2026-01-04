import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth()
  if (userId) redirect("/dashboard")
  return (

    <div className="flex items-center justify-center h-[100vh] w-full text-xl">Landing Page</div>
  );
}
