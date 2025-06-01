"use server";

import { prisma } from "@/lib/prisma";
import { CreatetransactionSchema, CreatetransactionSchematype } from "@/schema/transaction";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import { RedirectType } from "next/navigation";
import { redirect } from 'next/navigation'

export async function CreateTransaction(form:CreatetransactionSchematype) {
    const parsedBody = CreatetransactionSchema.safeParse(form);
    if(!parsedBody.success){
        throw new Error(parsedBody.error.message);
    }

    const user = await currentUser();
    if(!user){
        redirect("/sign-in");
    }
    
    const {amount,category,date,description,type} = parsedBody.data;
    const categoryRow = await prisma.category.findFirst({
        where: {
            userId : user.id,
            name : category,

        },
    });

    if(!categoryRow){
        throw new Error("category not found");

    }
    // dont confuse with $transaction(primsa) and prisma.transaction(table)

    await prisma.$transaction([
        //create user transaction 
        prisma.transaction.create({
            data:{
                userId : user.id,
                amount,
                date,
                description : description || "",
                type,
                category :categoryRow.name,
                categoryIcon : categoryRow.icon,

            },

        }),

        //update month agregate table
        
        prisma.yearHistory.upsert({
            where: {
                month_year_userId:{
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create :{
                userId : user.id,
                
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "expense" ? amount : 0,
                
            },
            update:{
                expense: {
                    increment: type  === "expense" ? amount : 0,
                },
                income: {
                    increment: type  === "income" ? amount : 0,
                },
            },
        }),

        //update year aggregate

         prisma.monthHistory.upsert({
            where: {
                day_month_year_userId:{
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create :{
                userId : user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "expense" ? amount : 0,
                
            },
            update:{
                expense: {
                    increment: type  === "expense" ? amount : 0,
                },
                income: {
                    increment: type  === "income" ? amount : 0,
                },
            }
        })
    ]);
}