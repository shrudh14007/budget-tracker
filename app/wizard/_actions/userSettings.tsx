'use server';

import { prisma } from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { UserSearch } from "lucide-react";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency:string) {
    const parsedBody = UpdateUserCurrencySchema.safeParse(
        {currency},
    );

    if(!parsedBody.success){
        throw parsedBody.error;

    }
    
    const user = await currentUser();
    if(!user) {
        redirect("sign-in");

    }
    const UserSettings = await prisma.userSettings.update({
        where:{
            userId: user.id,
        },
        data: {
            currency,

        },
    });

    return UserSettings;
}