"use client";

import { Review } from "@/type";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebound";
import axios from "axios";
import { handleRequest } from "../utils/apiRequest";
import { Filter, Loader } from "lucide-react";
import ReviewCard from "./ReviewCard";

const Reviews = () => {
  const [company, setCompany] = useState("");
  const [vibe, setVibe] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const debouncedCompany = useDebounce(company, 500);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchReviews = async() => {
      const reviewReq = async () =>
        await axios.get("http://localhost:8000/api/v1/reviews/all", {
          params: {
            companyName: debouncedCompany,
            vibe,
            search: debouncedSearch,
            sort,
            page,
            limit: 100000000000000000000000000000000, // big enough to get all
          },
        });

      const result = await handleRequest(reviewReq, setIsLoading);

      if (result?.data.status === "success") {
        setReviews(result.data.data.reviews);
        setTotalPages(result.data.data.totalPages);
      }

      // console.log("Fetched reviews:", result?.data.data.reviews);
    };

    fetchReviews();
  }, [debouncedCompany, vibe, debouncedSearch, sort, page]);

  return (
    <div>
      <div className="sm:w-[80%] w-full p-6 mx-auto mt-[8rem]">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews</h1>
          <p className="text-gray-600">Customer Feedback and Experince</p>
        </div>
        {/* filter section */}
        <div className="bg-white dark:bg-black dark:text-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* search company */}
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setPage(1);
                }}
                placeholder="Enter Company Name"
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Vibe selection */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vibe
              </label>
              <select
                className="w-full px-3 py-2 border dark:bg-black dark:text-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                value={vibe}
                onChange={(e) => {
                  setVibe(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            {/* search for reviews */}
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search Reviews"
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* reviews header and soring options */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0 ">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Public Reviews
            </h1>
            <p className="text-gray-600">Showing {reviews.length} reviews</p>
          </div>
          <div className="flex flex-col sm:flex-row  items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                className="border rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition-all text-center cursor-pointer"
              onClick={() => {
                router.push("/share-story");
              }}
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* reviews list */}
        {isLoading && (
          <div className="text-center ">
            <Loader className="w-6 h-6 mx-auto animate-spin" />
          </div>
        )}

        {!isLoading && <div className="grid grid-col-1 lg:grid-cols-2 gap-6 mb-8">
          {reviews.map((review)=>(
            //  review Card
            <ReviewCard key={review._id} review={review}/>
          ))}
          </div>}


          {/* Pagination basically multiple pages for more reviews */}

      </div>
    </div>
  );
};

export default Reviews;
