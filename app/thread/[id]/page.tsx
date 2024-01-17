import Thread from "@/components/Thread";
import ThreadInput from "@/components/ThreadInput";

type ThreadPageProps = {
  params: {
    id: string;
  };
};

export default function ThreadPage({ params: { id } }: ThreadPageProps) {
  return (
    <div className="flex flex-col h-screen">
      <Thread id={id} />
      <ThreadInput id={id} />
    </div>
  );
}
