
// // app/companies/page.tsx
// import Link from "next/link";
// import TotalStats from "@/components/Company/TotalStats";
// import Card from "@/components/Company/Card";

// export default async function CompaniesPage({
//   searchParams,
// }: {
//   searchParams: { search?: string; sort?: string; page?: string };
// }) {
//   const { search = "", sort = "complaints_desc", page = "1" } = searchParams;

//   // server fetch stats
//   const statsRes = await fetch(
//     `http://localhost:8000/api/v1/companies/total-stats`,
//     { cache: "no-store" }
//   );
//   const statsJson = await statsRes.json();
//   const stats = statsJson.data.stats;

//   // server fetch list
//   const listRes = await fetch(
//     `http://localhost:8000/api/v1/companies/stats?sort=${sort}&search=${search}&page=${page}`,
//     { cache: "no-store" }
//   );
//   const listJson = await listRes.json();
//   const { companies, totalCompanies } = listJson.data;

//   const currentPage = Number(page);
//   const totalPages = Math.ceil(totalCompanies / Number());

//   return (
//     <div className="p-8 mx-auto sm:w-[80%] mt-24">
//       {/* Search & Sort Form */}
//       <form method="get" className="flex gap-2 mb-6">
//         <input
//           name="search"
//           defaultValue={search}
//           placeholder="Search Companies"
//           className="px-4 py-2 border rounded"
//         />
//         <select name="sort" defaultValue={sort}>
//           <option value="complaints_desc">Complaint Rate ↓</option>
//           <option value="complaints_asc">Complaint Rate ↑</option>
//           <option value="reviews_desc">Total Reviews ↓</option>
//           <option value="reviews_asc">Total Reviews ↑</option>
//         </select>
//         <button type="submit" className="px-4 bg-blue-600 text-white rounded">
//           Apply
//         </button>
//       </form>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <TotalStats title="Total Companies" type="companies" value={stats.totalCompanies} />
//         <TotalStats title="Total Reviews" type="reviews" value={stats.totalReviews} />
//         <TotalStats
//           title="Average Complaint rate"
//           type="complaints"
//           value={`${stats.averageComplaintRate}%`}
//         />
//       </div>

//       {/* Company List */}
//       <Card companies={companies} />

//       {/* Pagination */}
//       <nav className="flex justify-center gap-2 mt-8">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//           <Link
//             key={p}
//             href={{
//               pathname: "/companies",
//               query: { search, sort, page: p.toString(), },
//             }}
//             className={`px-3 py-1 border rounded ${
//               p === currentPage ? "bg-blue-500 text-white" : "bg-gray-100"
//             }`}
//           >
//             {p}
//           </Link>
//         ))}
//       </nav>
//     </div>
//   );
// }









// components/Company/CompanyClient.tsx
// 'use client';

import { fetchTotalStats, fetchCompanies } from "../utils/companyAPI";
import TotalStats from "./TotalStats";
import Card from "./Card";
import { ChevronDown, ChevronUp } from "lucide-react";

type SortField = "complaintRate" | "totalReviews";
type SortOrder = "asc" | "desc";

interface QueryParams {
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

interface CompanyServerProps {
  searchParams?: QueryParams;
}

export default async function CompanyServer({ searchParams }: CompanyServerProps) {
  const {
    search = "",
    sort = "complaints_desc",
    page = "1",
    limit = "9",
  } = searchParams ?? {};

  const sortField: SortField = sort.startsWith("reviews") ? "totalReviews" : "complaintRate";
  const sortOrder: SortOrder = sort.endsWith("_asc") ? "asc" : "desc";
  const pageNum = Number(page);
  const pageSize = Number(limit);

  const statsRes = await fetchTotalStats();
  const stats = statsRes.data.data.stats;

  const companiesRes = await fetchCompanies({
    sort,
    search,
    page: pageNum,
    limit: pageSize,
  });

  const companies = companiesRes.data.data.companies;
  const totalCompanies = companiesRes.data.data.totalCompanies;

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortOrder === "desc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const buildSortLink = (field: SortField) => {
    const newOrder = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    const prefix = field === "totalReviews" ? "reviews" : "complaints";
    const newSort = `${prefix}_${newOrder}`;
    return `?search=${search}&sort=${newSort}&page=1&limit=${limit}`;
  };

  return (
    <div className="sm:w-[80%] w-full p-8 mx-auto mb-8 mt-[8rem]">
      <h1 className="sm:text-3xl text-2xl font-bold text-gray-900 mb-2">
        Company Statistics
      </h1>
      <p>Detailed Performance Metrics To Our Customers</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
        <TotalStats title="Total Companies" type="companies" value={stats.totalCompanies} />
        <TotalStats title="Total Reviews" type="reviews" value={stats.totalReviews} />
        <TotalStats title="Average Complaint rate" type="complaints" value={`${stats.averageComplaintRate}%`} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="sm:text-2xl text-xl font-bold text-gray-900 mb-2">
            Company Performance Ranking
          </h2>
          <p className="text-gray-600">Click on the metrics to sort companies</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          {/* Search form */}
          <form method="GET" className="flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search Companies"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input type="hidden" name="sort" value={sort} />
            <input type="hidden" name="page" value="1" />
            <input type="hidden" name="limit" value={limit} />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Search
            </button>
          </form>

          {/* Sort buttons */}
          <a href={buildSortLink("complaintRate")}>
            <button
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sortField === "complaintRate"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Complaint Rate {getSortIcon("complaintRate")}
            </button>
          </a>
          <a href={buildSortLink("totalReviews")}>
            <button
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sortField === "totalReviews"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Total Reviews {getSortIcon("totalReviews")}
            </button>
          </a>
        </div>
      </div>

      <Card companies={companies} />
    </div>
  );
}
