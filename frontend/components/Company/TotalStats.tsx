'use client'
import { BarChart, BarChart3, Building2, TrendingDown } from 'lucide-react';
import React from 'react'

type Props = {
    type: "companies" | "reviews" | "complaints";
    title:string;
    value:string|number
}

const TotalStats = ({title,type,value}:Props) => {
    const getItem = async () => {
        switch (type) {
            case "companies":
                return <Building2 className='w-8 h-8 text-blue-600'/>
            case "reviews":
                return <BarChart3 className='w-8 h-8 text-green-600'/>
            case "complaints":
                return <TrendingDown className='w-8 h-8 text-red-600'/>
        }
    }
  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-sm hover:shadow-lg border-gray-200 hover:ring-4 hover:ring-blue-400 hover:shadow-blue-400 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        </div>
        <div className='flex-shrink-0'>
            {getItem()}

        </div>
      </div>
    </div>
  );
}

export default TotalStats
