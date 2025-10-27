import  Link  from "next/link";
import React from 'react'

const Hero = () => {
  return (
    <div className="relative overflow-hidden w-full h-screen flex items-center justify-center flex-col">
      <div className="px-4 sm:px-6 lg:px-8 py-24 ">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Financial Institution
            <span className="text-blue-600 block">Review Platform</span>
          </h1>
          <p className="sm:text-xl text-base text-gray-600 mb-8 max-w-3xl mx-auto">
            Share your experiences with banks and financial institutions. Help
            others make informed decisions with authentic reviews and ratings
            from real customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/share-story"
              className="inline-flex items-center px-8 py-3 border-transparent text-base font-medium rounded-md text-white transition-colors duration-200 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:px-10 sm:py-3 sm:text-xl sm:leading-8"
            >
              Share Your Story
            </Link>
            <Link
              href="/share-story"
              className="inline-flex items-baseline px-8 py-3 transition-colors border duration-200 border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:px-10 sm:py-3 sm:text-xl sm:leading-8"
            >
              Browse Reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero
