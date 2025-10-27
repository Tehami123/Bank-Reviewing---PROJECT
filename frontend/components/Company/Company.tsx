// 'use client'

// import React, { useEffect, useState } from "react";
// import { useDebounce } from "../hooks/useDebound";
// import axios from "axios";
// import { handleRequest } from "../utils/apiRequest";
// import { ChevronDown, ChevronUp, Loader } from "lucide-react";
// import TotalStats from "./TotalStats";
// import Card from "./Card";

// type SortField = "complaintRate" | "totalReviews";
// type SortOrder = "asc" | "desc";

// const Company = () => {
//   const [sortField, setSortField] = useState<SortField>("complaintRate");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
//   const [companies, setCompanies] = useState<any[]>([]);
//   const [totalCompanies, setTotalCompanies] = useState(0);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(9);

//   const [totalStats, setTotalStats] = useState({
//     averageComplaintRate: 0,
//     totalCompanies: 0,
//     totalReviews: 0,
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const debounceSearch = useDebounce(searchQuery, 500);

//   // Fetch total stats
//   useEffect(() => {
//     const fetchTotalStats = async () => {
//       try {
//         const totalStatReq = async () =>
//           await axios.get("http://localhost:8000/api/v1/companies/total-stats");

//         const result = await handleRequest(totalStatReq);

//         if (
//           result &&
//           result.data &&
//           result.data.data &&
//           typeof result.data.data.stats === "object"
//         ) {
//           setTotalStats(result.data.data.stats);
//         } else {
//           console.warn("Unexpected total stats response:", result);
//         }
//       } catch (error) {
//         console.error("Error fetching total stats:", error);
//       }
//     };

//     fetchTotalStats();
//   }, []);

//   // Fetch company stats
//   useEffect(() => {
//     const getCompanyStats = async () => {
//       try {
//         const sortParam =
//           sortField === "totalReviews"
//             ? `reviews_${sortOrder}`
//             : `complaints_${sortOrder}`;

//         const safeSearch =
//           typeof debounceSearch === "string" ? debounceSearch : "";

//         const companyStatReq = async () =>
//           await axios.get("http://localhost:8000/api/v1/companies/stats", {
//             params: {
//               sort: sortParam,
//               search: safeSearch,
//               page,
//               limit,
//             },
//           });

//         const result = await handleRequest(companyStatReq, setIsLoading);

//         if (
//           result &&
//           result.data &&
//           result.data.data &&
//           Array.isArray(result.data.data.companies)
//         ) {
//           setCompanies(result.data.data.companies);
//           setTotalCompanies(result.data.data.totalCompanies || 0);
//         } else {
//           console.warn("Unexpected companies response:", result);
//           setCompanies([]);
//           setTotalCompanies(0);
//         }
//       } catch (error) {
//         console.error("Error fetching company stats:", error);
//         setCompanies([]);
//         setTotalCompanies(0);
//       }
//     };

//     getCompanyStats();
//   }, [sortField, sortOrder, debounceSearch, page, limit]);

//   const getSortItems = (field: SortField) => {
//     if (field !== sortField) return null;
//     return sortOrder === "desc" ? (
//       <ChevronUp className="w-4 h-4 ml-1" />
//     ) : (
//       <ChevronDown className="w-4 h-4 ml-1" />
//     );
//   };

//   const handleSort = (field: SortField) => {
//     if (field === sortField) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder(field === "complaintRate" ? "desc" : "asc");
//     }
//   };

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const isLastPage = page * limit >= totalCompanies;

//   return (
//     <div className="sm:w-[80%] w-full p-8 mx-auto mb-8 mt-[8rem]">
//       {/* Header */}
//       <div>
//         <h1 className="sm:text-3xl text-2xl font-bold text-gray-900 mb-2">
//           Company Statistics
//         </h1>
//         <p>Detailed Performance Metrics To Our Customers</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
//         <TotalStats
//           title="Total Companies"
//           type="companies"
//           value={totalStats.totalCompanies}
//         />
//         <TotalStats
//           title="Total Reviews"
//           type="reviews"
//           value={totalStats.totalReviews}
//         />
//         <TotalStats
//           title="Average Complaint rate"
//           type="complaints"
//           value={`${totalStats.averageComplaintRate}%`}
//         />
//       </div>

//       {/* Company Ranking */}
//       <div className="mt-12">
//         {/* Sort Control */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <div>
//             <h1 className="sm:text-2xl text-xl font-bold text-gray-900 mb-2">
//               Company Performance Ranking
//             </h1>
//             <p className="text-gray-600">
//               Click on the metrics to sort companies
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Search Companies"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 border placeholder:text-base sm:placeholder:text-base border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <button
//               onClick={() => handleSort("complaintRate")}
//               className={`flex cursor-pointer items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                 sortField === "complaintRate"
//                   ? "bg-blue-100 text-blue-700 border border-blue-200"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}
//             >
//               Complaint Rate
//               {getSortItems("complaintRate")}
//             </button>
//             <button
//               onClick={() => handleSort("totalReviews")}
//               className={`flex cursor-pointer items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                 sortField === "totalReviews"
//                   ? "bg-blue-100 hover:text-blue-700 border border-blue-200"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}
//             >
//               Total Reviews
//               {getSortItems("totalReviews")}
//             </button>
//           </div>
//         </div>

//         {/* Company Cards */}
//         {isLoading && (
//           <div className="text-center">
//             <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
//           </div>
//         )}
//         {!isLoading && Array.isArray(companies) && (
//           <Card companies={companies} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Company;





















// 'use client';

// import React, { useEffect, useState } from "react";
// import { useDebounce } from "../hooks/useDebound";
// import axios from "axios";
// import { handleRequest } from "../utils/apiRequest";
// import { ChevronDown, ChevronUp, Loader } from "lucide-react";
// import TotalStats from "./TotalStats";
// import Card from "./Card";

// type SortField = "complaintRate" | "totalReviews";
// type SortOrder = "asc" | "desc";






// const Company = () => {
//  const [companies, setCompanies] = useState<any[]>([]);
//   const [totalCompanies, setTotalCompanies] = useState(0);
//   const [totalStats, setTotalStats] = useState({
//     averageComplaintRate: 0,
//     totalCompanies: 0,
//     totalReviews: 0,
//   });
//   const [sortField, setSortField] = useState<SortField>("complaintRate");
// const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

//   const [page, setPage] = useState(1);
//   const [limit] = useState(9);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const debounceSearch = useDebounce(searchQuery, 500);
// const safeSearch = debounceSearch; // no typeof check needed



//   const getSortItems = (field: SortField) => {
//     if (field !== sortField) return null;
//     return sortOrder === "desc" ? (
//       <ChevronUp className="w-4 h-4 ml-1" />
//     ) : (
//       <ChevronDown className="w-4 h-4 ml-1" />
//     );
//   };

//   const handleSort = (field: SortField) => {
//     if (field === sortField) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder(field === "complaintRate" ? "desc" : "asc");
//     }
//   };

//   useEffect(() => {
//     const fetchTotalStats = async () => {
//       const req = async () =>
//         await axios.get("http://localhost:8000/api/v1/companies/total-stats");
//       const result = await handleRequest(req);
//       if (result?.data?.data?.stats) {
//         setTotalStats(result.data.data.stats);
//       }
//     };
//     fetchTotalStats();
//   }, []);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       const sortParam =
//         sortField === "totalReviews"
//           ? `reviews_${sortOrder}`
//           : `complaints_${sortOrder}`;
//       const safeSearch = typeof debounceSearch === "string" ? debounceSearch : "";
//       const req = async () =>
//         await axios.get("http://localhost:8000/api/v1/companies/stats", {
//           params: { sort: sortParam, search: safeSearch, page, limit },
//         });
//       const result = await handleRequest(req, setIsLoading);
//       if (Array.isArray(result?.data?.data?.companies)) {
//         setCompanies(result.data.data.companies);
//         setTotalCompanies(result.data.data.totalCompanies || 0);
//       }
//     };
//     fetchCompanies();
//   }, [sortField, sortOrder, debounceSearch, page, limit]);

//   return (
   
//   );
// };

// export default Company;


























// components/Company.tsx
// components/Company.tsx
// components/CompanyClient.tsx

// 'use client';

// import React, { useState, useEffect } from "react";
// import { useDebounce } from "../hooks/useDebound";
// import { fetchTotalStats, fetchCompanies } from "../utils/companyAPI";
// import { ChevronDown, ChevronUp, Loader } from "lucide-react";
// import TotalStats from "./TotalStats";
// import Card from "./Card";

// type SortField = "complaintRate" | "totalReviews";
// type SortOrder = "asc" | "desc";

// interface Props {
//   initialStats: {
//     averageComplaintRate: number;
//     totalCompanies: number;
//     totalReviews: number;
//   };
//   initialCompanies: any[];
//   initialTotal: number;
// }

// export default function Company({
//   initialStats,
//   initialCompanies,
//   initialTotal,
// }: Props) {
//   const [stats, setStats] = useState(initialStats);
//   const [companies, setCompanies] = useState(initialCompanies);
//   const [totalCompanies, setTotalCompanies] = useState(initialTotal);

//   const [sortField, setSortField] = useState<SortField>("complaintRate");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
//   const [page, setPage] = useState(1);
//   const [limit] = useState(9);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const debounceSearch = useDebounce(searchQuery, 500);

//   const getSortIcon = (field: SortField) => {
//     if (field !== sortField) return null;
//     return sortOrder === "desc" ? (
//       <ChevronUp className="w-4 h-4 ml-1" />
//     ) : (
//       <ChevronDown className="w-4 h-4 ml-1" />
//     );
//   };

//   const handleSort = (field: SortField) => {
//     if (field === sortField) {
//       setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
//     } else {
//       setSortField(field);
//       setSortOrder(field === "complaintRate" ? "desc" : "asc");
//     }
//   };

//   // always pull fresh stats on mount (optional)
//   useEffect(() => {
//     setIsLoading(true);
//     fetchTotalStats()
//       .then((res) => setStats(res.data.data.stats))
//       .finally(() => setIsLoading(false));
//   }, []);

//   // pull sorted / paged list whenever controls change
//   useEffect(() => {
//     setIsLoading(true);
//     const sortParam =
//       sortField === "totalReviews"
//         ? `reviews_${sortOrder}`
//         : `complaints_${sortOrder}`;
//     const safeSearch =
//       typeof debounceSearch === "string" ? debounceSearch : "";
//     fetchCompanies({ sort: sortParam, search: safeSearch, page, limit })
//       .then((res) => {
//         setCompanies(res.data.data.companies);
//         setTotalCompanies(res.data.data.totalCompanies);
//       })
//       .finally(() => setIsLoading(false));
//   }, [sortField, sortOrder, debounceSearch, page, limit]);

//   return (
//     <div className="sm:w-[80%] w-full p-8 mx-auto mb-8 mt-[8rem]">
//       {/* Header */}
//       <h1 className="sm:text-3xl text-2xl font-bold text-gray-900 mb-2">
//         Company Statistics
//       </h1>
//       <p>Detailed Performance Metrics To Our Customers</p>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
//         <TotalStats
//           title="Total Companies"
//           type="companies"
//           value={stats.totalCompanies}
//         />
//         <TotalStats
//           title="Total Reviews"
//           type="reviews"
//           value={stats.totalReviews}
//         />
//         <TotalStats
//           title="Average Complaint rate"
//           type="complaints"
//           value={`${stats.averageComplaintRate}%`}
//         />
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div>
//           <h2 className="sm:text-2xl text-xl font-bold text-gray-900 mb-2">
//             Company Performance Ranking
//           </h2>
//           <p className="text-gray-600">Click on the metrics to sort companies</p>
//         </div>
//         <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
//           <input
//             type="text"
//             placeholder="Search Companies"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={() => handleSort("complaintRate")}
//             className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//               sortField === "complaintRate"
//                 ? "bg-blue-100 text-blue-700 border border-blue-200"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             Complaint Rate {getSortIcon("complaintRate")}
//           </button>
//           <button
//             onClick={() => handleSort("totalReviews")}
//             className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//               sortField === "totalReviews"
//                 ? "bg-blue-100 text-blue-700 border border-blue-200"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             Total Reviews {getSortIcon("totalReviews")}
//           </button>
//         </div>
//       </div>

//       {/* List or Loader */}
//       {isLoading ? (
//         <div className="text-center">
//           <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
//         </div>
//       ) : (
//         <Card companies={companies} />
//       )}
//     </div>
//   );
// }



// no "use client" here—this is a server component
// components/Company/Company.tsx
import CompanyClient from "./CompanyClient";

interface Props {
  initialStats: {
    averageComplaintRate: number;
    totalCompanies: number;
    totalReviews: number;
  };
  initialCompanies: any[];
  initialTotal: number;
}

export default function Company({
  initialStats,
  initialCompanies,
  initialTotal,
}: Props) {
  return (
    <CompanyClient
      initialStats={initialStats}
      initialCompanies={initialCompanies}
      initialTotal={initialTotal}
    />
  );
}

