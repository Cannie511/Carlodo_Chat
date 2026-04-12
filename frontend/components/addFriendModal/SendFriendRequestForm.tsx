import React from 'react'
import { UseFormRegister } from 'react-hook-form';
import { IFormValue } from '../AddFriendModal';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { CircleArrowLeft, UserPlus } from 'lucide-react';

interface SendRequestProps {
    register: UseFormRegister<IFormValue>;
    loading: boolean;
    displayNameValue: string;
    searchedDisplayName: string | undefined;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>)=>void;
    onBack: () => void;
}

const SendFriendRequestForm = (props: SendRequestProps) => {
  return (
    <form onSubmit={props.onSubmit} className='space-y-4'>
       <div className="space-y-2">
        <Label htmlFor='message' className='text-sm'>Gửi lời chào tới<span className='font-semibold'>{props.searchedDisplayName}</span></Label>
        <Textarea id='message' rows={3} placeholder='Chào bạn~ Chúng ta kết bạn nhé...' 
        className='glass border-border/50 fucus:border-primary/50 transition-smooth resize-none'
        {...props.register("message")}/>
        </div> 
        <DialogFooter>
            <Button type='button' variant={'outline'} className='glass flex-1 hover:text-destructive' onClick={props.onBack}><CircleArrowLeft className='size-4 mr-1'/> Trở lại</Button>
            <Button 
            type='submit'
             disabled={props.loading} 
             className='flex-1 text-white bg-gradient-chat hover:opacity-90 transition-smooth' 
           >
                {
                    props.loading ? (
                        <span><Spinner className='size-4 mr-1' /> Đang gửi...</span>
                    ) : (
                        <>
                            <UserPlus className='size-4 mr-1'/> Kết bạn
                        </>
                    )
                }
            </Button>
        </DialogFooter>
    </form>
  )
}

export default SendFriendRequestForm