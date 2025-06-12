import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request:Request) {
    const user = await currentUser();
    if(!user){
        redirect(/sign-in);

    }
    const {searchParams} = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const queryParams= OverviewQuerySchema.safeParse({
        from,
        to,

    });

    if(!queryParams.success){
        return Response.json(queryParams.error.message,{
            status:400,
        })

    }
    const transactions = await getTransactionsHistory(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    );

    return transactions;
    
    
}