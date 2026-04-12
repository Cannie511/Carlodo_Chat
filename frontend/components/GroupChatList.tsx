import { useChatStore } from '@/app/stores/useChatStore';
import GroupChatCard from './GroupChatCard';

const GroupChatList = () => {
  const {conversations} = useChatStore();
  if(!conversations) return null;
  const groupChat = conversations.filter((c)=> c.type === 'group');
  if(groupChat.length === 0) return (
    <div className='p-2 font-bold'>
      Chưa có tin nhắn nào
    </div>
  )
  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {
        groupChat.map((d)=> {
          return(
            <GroupChatCard conversation={d} key={d._id}/>
          )
        })
      }
    </div>
  )
}

export default GroupChatList