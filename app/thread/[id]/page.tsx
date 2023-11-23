import { ChatProvider } from "@/app/context/ChatContext";
import Thread from '@/components/Thread';
import ThreadInput from '@/components/ThreadInput';

type ThreadPageProps = {
  params: {
    id: string;
  };
};

export default function ThreadPage({ params: { id } }: ThreadPageProps) {
    return (
        <ChatProvider>
            <div className='flex flex-col h-screen'>
                <Thread id={id} />
                <ThreadInput id={id} />
            </div>
        </ChatProvider>
    );
}