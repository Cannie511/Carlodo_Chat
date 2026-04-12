import React from 'react'
import { IFormValue } from '../AddFriendModal'
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Search, X } from 'lucide-react';
import { Spinner } from '../ui/spinner';


interface SearchFormProps {
    register: UseFormRegister<IFormValue>;
    errors: FieldErrors<IFormValue>;
    loading: boolean;
    displayNameValue: string;
    isFound: boolean | null;
    searchedDisplayName: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>)=>void;
    onCancel: () => void;
}

const SearchFom = (props:SearchFormProps) => {
  return (
    <form onSubmit={props.onSubmit} className='space-y-4'>
        <div className='space-y-2'>
            <Label htmlFor='displayName' className='text-sm font-semibold'>Tìm tên bạn bè</Label>
            <Input id='displayName' placeholder='Nhập tên bạn bè để tìm kiếm...' 
            className='glass border-border/50 focus:border-primary/50 transition-smooth' 
            {...props.register?.("displayName", {
                required: "Tên bạn bè không được để trống"
            })}
            />
            {props.errors.displayName && (
                <p className='error-message'>
                    {props.errors.displayName.message}
                </p>
            )}

            {props.isFound === false && (
                <span className='error-message'>Không tìm thấy
                    <span className='font-semibold'>{' "'}{props.searchedDisplayName}{'"'}</span>
                </span>
            )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type='button' variant={'outline'} className='flex-1 glass hover:text-destructive' onClick={props.onCancel}>
                    <X className='size-4 mr-2'/> Hủy
                </Button>
            </DialogClose>
            <Button disabled={props.loading || !props.displayNameValue?.trim()} className='flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth'>
                {
                    props.loading ? (
                        <span><Spinner className='size-4 mr-1' /> Đang tìm...</span>
                    ) : (
                        <>
                            <Search className='size-4 mr-1'/> Tìm kiếm
                        </>
                    )
                }
            </Button>
        </DialogFooter>
    </form>
  )
}

export default SearchFom