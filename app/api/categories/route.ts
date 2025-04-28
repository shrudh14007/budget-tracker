import { Prisma } from "@/lib/generated/prisma";
import { Param } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request:Request) {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");

    }
    const {searchParams} = new URL(request.url);
    const paraType = searchParams.get("type");
    
    const validator = z.enum(["expense","income"]).nullable(); 
    const queryParams = validator.safeParse(paraType);
    if(!queryParams.success){
        return Response.json(queryParams.error,{
            status : 400,
        });
    }
    const type = queryParams.data;
    const categories = await prisma.category.findMany({
        where : {
            userId : user.id,
            ...(type && {type}), //include type in the filters if it is defined
        },
        orderBy: {
            name : "asc",

        }
    });
    return Response.json(categories);
}