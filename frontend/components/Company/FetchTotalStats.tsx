// 'use client'
// import React, { useEffect } from "react";
// import { useState } from "react";
// import { useDebounce } from "../hooks/useDebound";
// import axios from "axios";
// import { handleRequest } from "../utils/apiRequest";
// import { ChevronDown, ChevronUp, Loader } from "lucide-react";
// import TotalStats from "./TotalStats";
// import Card from "./Card";

// type SortField = "complaintRate" | "totalReviews";
// type SortOrder = "asc" | "desc";

// const FetchTotalStats = () => {





//       // define some state variables
//         const [sortField, setSortField] =useState<SortField>("complaintRate");
//         const [sortOrder, setSortOrder] =useState<SortOrder>("desc");
//         const [companies, setCompanies] = useState([]);
//         const [totalCompanies, setTotalCompanies] = useState(0);
//         const [page, setPage] = useState(1);
//         const [limit] = useState(9);
        
//         const [totalStats, setTotalStats] = useState({
//             averageComplaintRate: 0,
//             totalCompanies: 0,
//             totalReviews: 0,
//         });
        
//         const [isLoading, setIsLoading] = useState(false);
//         const [searchQuery, setSearchQuery] = useState("");
    
//         // get the debounce search function from the debounce hook
//         const debounceSearch = useDebounce(searchQuery, 500);


//     useEffect(() => {
//   const fetchTotalStats = async () => {
//     const totalStatReq = async () => await axios.get("http://localhost:8000/api/v1/companies/total-stats");
//     const result = await handleRequest(totalStatReq)

//     if (result) {
//         setTotalStats(result?.data?.data?.stats)
//     }
    
    

    
//   }
//   fetchTotalStats();
// }, []);


// //  get all comapnies stats

// useEffect(() => {
//   const getCompanyStats = async () => {
//     const sortParam = sortField === "totalReviews"? `reviews_${sortOrder}` : `complaints_${sortOrder}` 
    
//     const companyStatReq = async () => await axios.get("http://localhost:8000/api/v1/companies/stats",{
//         params:{
//             sort:sortParam,
//             search:debounceSearch,
//             page,
//             limit,
//         }
//     });

//     const result = await handleRequest(companyStatReq,setIsLoading);
//     if (result) {
//         console.log(result);
        
//         // setCompanies(result?.data?.data?.companies);
//         // setTotalCompanies(result?.data?.data?.totalCompanies);

//     }
//   }
//   getCompanyStats();
// }, [sortField,sortOrder,debounceSearch]);



// const getSortItems = (field:SortField) => {
//     if (field !== sortField) {
//         return null;
//     }
//     return sortOrder === "desc" ? (
//         <ChevronUp className="w-4 h-4 ml-1"/>
//     )
//     : (
//         <ChevronDown className="w-4 h-4 ml-1"/>
//     )
// }


// const handleSort = (field:SortField) => {
//     if (field === sortField) {
        
//         setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     }
//     else{
//         setSortField(field);
//         setSortOrder(field === "complaintRate" ? 'desc' : "asc")

//     }
// }

// const scrollToTop = ()=>{
//     window.scrollTo({
//         top: 0,
//         behavior: "smooth"
//     })
// }

// const isLastPage = page * limit >= totalCompanies;



    
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default FetchTotalStats
