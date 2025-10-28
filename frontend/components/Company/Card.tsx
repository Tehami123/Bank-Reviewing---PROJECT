'use client'
import { CompanyType } from "@/type";
import { TrendingDown, TrendingUp, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";


interface CardProps {
  companies: CompanyType[];
}


const Card = ({companies}:CardProps) => {

    const router = useRouter();

const getComplaintRateColor = (rate:number)=>{
if(rate > 35) return "text-red-600 bg-red-100";
 if(rate > 25) return "text-yellow-600 bg-yellow-100";
return "text-green-600 bg-green-100";
}

  return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
    
    {companies.map((company,index)=>{
        
          return (
            <div
              key={company._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:scale-105 border border-gray-200 dark:border-gray-700 hover:shadow-blue-500 dark:hover:shadow-blue-500/30 hover:border-4 hover:border-blue-600 dark:hover:border-blue-500 p-6 hover:shadow-lg transition-all duration-300 hover:rounded-2xl group"
            >
              Bank Batch
              <div className="flex items-start justify-between mb-4 ">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                    {index + 1}
                  </div>
                </div>
              </div>
              {/* company name */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {company.name}
                </h3>
              </div>
              {/* metrics grid
               */}
              <div className="grid grid-cols-2 mb-4">
                <div className="bg-muted rounded-lg p-3 dark:bg-secondary">
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Total Reviews
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {company.totalReviews}
                  </p>
                </div>

                <div
                  className={`rounded-lg p-3 ${getComplaintRateColor(
                    company.complaintRate
                  )}`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      Complaint Rate
                    </span>
                  </div>
                  <p className="text-2xl font-bold">
                    {company.complaintRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              {/* review breakdown */}
              <div className="space-y-2">
                {/* Neutral reviews count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-gray-700">
                      Postive
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {company.positiveCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-700">
                      Neutral
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {company.neutralCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-medium text-gray-700">
                      Negative
                    </span>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {company.negativeCount}
                  </span>
                </div>
                {/* Progess bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Postive Ratio</span>
                    <span>
                      {company.totalReviews > 0
                        ? `${(
                            (company.positiveCount / company.totalReviews) *
                            100
                          ).toFixed(1)}%`
                        : "0.0%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-ful h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500 "
                      style={{
                        width:
                          company.totalReviews > 0
                            ? (company.positiveCount / company.totalReviews) *
                                100 +
                              "%"
                            : "0%",
                      }}
                    >

                    </div>
                  </div>
                </div>
              </div>
              {/* action buttons */}
         
            </div>
          ); 
     })}
  
  </div>;
};

export default Card;
