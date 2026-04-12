'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '../ui/button';
import { BadgeMinus, Check, DoorOpen, PenLine, SquareArrowRightExit, UserRoundPlus, Users, X } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import UserAvatar from '../userAvatar';
import { Participant } from '@/app/types/chat';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { useChatStore } from '@/app/stores/useChatStore';
import { toast } from 'sonner';
import ConfirmDeleteGroupComponent from './ConfirmDeleteGroupComponent';
import AddMember from './AddMember';
import { Input } from '../ui/input';

interface conversationGroupBodyProps {
    avatarNode: React.ReactNode;
    groupName: string;
    members: Participant[];
    createdBy: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const ConversationGroupBody = ({avatarNode, groupName, members, createdBy, setOpen}: conversationGroupBodyProps) => {
    const { user } = useAuthStore();
    const {activeConversationId, removeParticipant, renameGroup} = useChatStore();
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
    const [addMemberOpen, setAddMemberOpen] = useState<boolean>(false);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [name, setName] = useState<string>(groupName ?? '');
    const handleRemoveParticipant = async (participantId: string) => { 
        if(user?._id.toString() !== participantId.toString() && createdBy.toString() !== user?._id.toString()) {
            console.log(user?._id !== participantId);
            toast.error("Chỉ trưởng nhóm mới có quyền loại bỏ thành viên khỏi nhóm chat này");
            return;
        }
        await removeParticipant(activeConversationId!, participantId);
        const newMembers = members.filter((m) => m._id !== participantId);
        members = newMembers;
    }

    const resetInput = () => {
        setName(groupName);
        setIsEditingName(false);
    }

    const handleRenameGroup = async () => {
        if(!name.trim()) return;
        await renameGroup(name);
        setIsEditingName(false);
    }

    const handleKeyChange = (e:React.KeyboardEvent) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            handleRenameGroup();
        }
    }

  return (
    <>
        {avatarNode}
        <div className="flex items-center justify-center">
            {
                !isEditingName ? (
                    <h2 className="font-semibold text-lg">{groupName}</h2>
                ) : (
                    <Input onKeyPress={handleKeyChange} autoFocus className='w-64 resize-none' value={name} onChange={(e) => setName(e.target.value)} maxLength={50} placeholder='Đổi tên nhóm...' />
                )
            }
            {
                !isEditingName ? (
                    <Button variant={'completeGhost'} onBlur={resetInput} onClick={()=>setIsEditingName(true)} size={'icon'} className="">
                        <PenLine className="size-4"/>
                    </Button>
                ):(
                    <div className='ml-2 space-x-2'>
                        <Button variant={'completeGhost'} onMouseDown={handleRenameGroup} size={'icon'} className="bg-gradient-chat hover:bg-primary/50">
                            <Check className="size-4"/>
                        </Button>
                        <Button variant={'destructive'} onClick={()=>setIsEditingName(false)} size={'icon'} className="">
                            <X className="size-4"/>
                        </Button>
                    </div>
                )
            }
        </div>
        {
            !addMemberOpen ? (
                <Card className="border-background shadow-lg p-3">
                    <CardContent className="px-2 space-y-2">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">Thành viên</h3>
                            <Users className="size-4"/>                            
                        </div>
                        {!isDeleteConfirmOpen && 
                            <div className="w-full ">
                                {user?._id === createdBy && 
                                    <Button variant={'default'} onClick={()=>setAddMemberOpen(true)} className="flex items-center text-white hover:bg-primary/50 transition-colors gap-2 w-full bg-gradient-chat" size={'sm'}>
                                        Thêm thành viên
                                        <UserRoundPlus className="size-4"/>
                                    </Button>
                                }
                            
                                <div className="space-y-3 mt-2 max-h-[400px] overflow-y-auto beautiful-scrollbar">
                                    {members.map((member)=>(
                                        <div key={member._id} className="flex items-center justify-between group py-1 ">
                                            <div className="flex items-center space-x-4">
                                                <UserAvatar type="chat" name={member.displayName} avatarUrl={member.avatarUrl || undefined} />
                                                <div>
                                                    <h3 className="text-md font-semibold">{member.displayName}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {createdBy === member._id && "Trưởng nhóm"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="block sm:hidden sm:group-hover:block transition-opacity duration-200">
                                                {user?._id === createdBy && member._id !== createdBy && (
                                                    <Button onClick={()=>handleRemoveParticipant(member._id)} className="p-0" size={'icon-sm'} variant={'completeGhost'}>
                                                        <BadgeMinus className="size-5 text-destructive"/>
                                                    </Button>
                                                )}
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                        {
                            isDeleteConfirmOpen && <ConfirmDeleteGroupComponent setOpen={setDeleteConfirmOpen} createdBy={createdBy} openDialog={setOpen}/>
                        }
                    </CardContent>
                    <CardFooter className="p-1">
                        {user?._id === createdBy ? (
                            <>
                                {
                                    !isDeleteConfirmOpen &&(
                                        <Button onClick={()=>setDeleteConfirmOpen(true)} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            <SquareArrowRightExit className="size-4"/> Giải tán nhóm chat
                                        </Button>
                                    )
                                }
                            </>
                        ):(
                            <>
                                {
                                    user && 
                                    <Button onClick={()=>handleRemoveParticipant(user?._id)} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        <DoorOpen className="size-4"/> Rời nhóm
                                    </Button>
                                }
                            </>
                        )}
                        
                    </CardFooter>
                </Card>
            ) : (
                <AddMember open={addMemberOpen} setOpen={setAddMemberOpen} members={members}/>
            )
        }
    </>
  )
}

export default ConversationGroupBody