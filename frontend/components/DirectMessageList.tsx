import { useChatStore } from '@/app/stores/useChatStore';
import DirectMessageCard from './DirectMessageCard';

const DirectMessageList = () => {
  const {conversations} = useChatStore();

  if(!conversations) return null;
  const directConversations = conversations.filter((c)=> c.type === 'direct');
  if(directConversations.length === 0) return (
    <div className='p-2 font-bold'>
      Chưa có tin nhắn nào
    </div>
  )
  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {
        directConversations.map((d)=> {
          return(
            <DirectMessageCard conversation={d} key={d._id}/>
          )
        })
      }
    </div>
  )
}

export default DirectMessageList