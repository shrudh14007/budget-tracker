"use client";
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { UserSettings } from '@/lib/generated/prisma';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import StatsCards from './StatsCards';
import CategoriesStats from './CategoriesStats';


function Overview({userSettings}: {userSettings : UserSettings}) {
    const[dateRange, setDateRange] = useState<{from: Date ; to:Date}>({
        from: startOfMonth(new Date()),
        to: new Date(), 
    })
  return (
    <>
<div className="flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className='text-3xl font-bold'>Overview</h2>
        <div className='flex items-center gap-3'>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialCompareTo={dateRange.to}
            showCompare={false}
            onUpdate={values => {
              const { from, to } = values.range;
              //update the date only if both the dates are set
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error("The selected date range is too big.Max allowed date range is ${MAX_DATE_RANGE_DAYS} days! "
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
    <div className="container flex w-full flex-col gap-2">
      <StatsCards
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />

      <CategoriesStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />

      </div>  
    </>
  );
}

export default Overview 