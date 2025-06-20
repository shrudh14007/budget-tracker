"use client";
import { Category } from '@/lib/generated/prisma';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactNode } from 'react'
import { DeleteCategory } from '../_actions/categories';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TransactionType } from '@/lib/types';

interface Props{
    trigger: ReactNode;
    category: Category;
    
}
function DeleteCategoryDialog({category,trigger} : Props) {
    const categoryIdentifier = `${category.name}-${category.name}`;
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn:DeleteCategory,
        onSuccess : async () => {
            toast.success("category deleted successfully",{
                id: categoryIdentifier,
            } );

        await queryClient.invalidateQueries({
        queryKey : ["categories"],

         });
        },
        onError : () =>{
            toast.error("Something went Wrong" ,{
                id:categoryIdentifier,
            });
        }
    });
    
    

  return (
  <AlertDialog>
    <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Are you absolutely sure? 
            </AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone.This will permanently delete your category
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick = { () => {
                    toast.loading("Deleting category...",{
                        id:categoryIdentifier,
                    });
                    deleteMutation.mutate({
                        name:category.name,
                        type : category.type as TransactionType,
                    });
                }}
                >       
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>)
}

export default DeleteCategoryDialog