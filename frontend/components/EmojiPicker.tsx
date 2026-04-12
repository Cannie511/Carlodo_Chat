import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Smile } from 'lucide-react';


interface EmojiPickerProps {
    onChange: (value:string) => void;
}

const EmojiPickerMesage = ({onChange}:EmojiPickerProps) => {
    const {theme} = useTheme();
  return (
    <Popover>
        <PopoverTrigger className='cursor-pointer'>
            <Smile className='size-4'/>
        </PopoverTrigger>
        <PopoverContent className='bg-transparent shadow-none border-0 w-fit relative -top-5 -left-10'>
            <EmojiPicker lazyLoadEmojis={true} onEmojiClick={(emojiObject:EmojiClickData) => {onChange(emojiObject.emoji)}} theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}/>
        </PopoverContent>
    </Popover>
  )
}

export default EmojiPickerMesage