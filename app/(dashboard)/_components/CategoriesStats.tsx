"use client";

import { UserSettings } from '@/lib/generated/prisma';
import { DatetoUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'

interface Props{
    userSettings:UserSettings;
    from: Date;
    to : Date;

}
function CategoriesStats({userSettings,from,to} : Props ) {
    const statsQuery = useQuery({
        queryKey:["overview","stats","categories",from,to],
        queryFn:() => fetch( `/api/stats/categories?from=${DatetoUTCDate(from).toISOString()}&to=${DatetoUTCDate(to).toISOString()}`
          ).then(res => res.json())
    })

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    },[userSettings.currency])

  return (
    <div className='flex w-full flex-wrap gap-2 md:flex-nowrap '>
        CategoriesStats
    </div>
  )
}

export default CategoriesStats