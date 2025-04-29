"use client";

import { Dialog } from '@/components/ui/dialog';
import { TransactionType } from '@/lib/types';
import { CreateCategorySchema, CreateCategorySchemaType } from '@/schema/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
interface Props{
    type : TransactionType;
}
function CreateCategoryDialog({type} : Props) {
    const[open,setOpen] = useState(false); 
    const form = useForm<CreateCategorySchemaType>({
        resolver : zodResolver(CreateCategorySchema),
        defaultValues : {
            type,
        },
    })
  return <Dialog open = {open} onOpenChange={setOpen};
    
}

export default CreateCategoryDialog