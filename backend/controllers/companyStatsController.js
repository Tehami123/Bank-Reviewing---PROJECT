const catchAsync = require('../utils/catchAsync');
const Company = require('../model/companyModel');


exports.getAllCompaniesTotalStats = catchAsync(async (req,res,next) => {
    // get all companies
    const companies = await Company.find()
    // get total companies
    const totalCompanies = companies.length;
    // calculate the total reviews
    const totalReviews = companies.reduce((acc,c)=>acc+(c.totalReviews || 0),0)


    // calculate the total complaints
    const totalComplaints = companies.reduce((acc,c)=>acc+(c.negativeCount || 0),0)
    // calculate average complaint rates
    const averageComplaintRate = totalReviews ===0?0:((totalComplaints/totalReviews)* 100).toFixed(2);
    // stats object 
    const stats = {
        totalCompanies,
        totalReviews,
        averageComplaintRate: Number(averageComplaintRate),
    };

    // send response 
    res.status(200).json({
        status:"success",
        data:{
            stats
        }
    })

})






// controllers/companyStatsController.js
// const catchAsync = require("../utils/catchAsync");
// const Company = require("../models/companyModel"); // make sure this path matches your actual file name/location

// exports.getAllCompaniesTotalStats = catchAsync(async (req, res, next) => {
//   const companies = await Company.find();

//   const totalCompanies = companies.length;
//   const totalReviews = companies.reduce((acc, c) => acc + (c.totalReviews || 0), 0);
//   const totalComplaints = companies.reduce((acc, c) => acc + (c.negativeCount || 0), 0);
//   const averageComplaintRate =
//     totalReviews === 0 ? 0 : ((totalComplaints / totalReviews) * 100).toFixed(2);

//   res.status(200).json({
//     status: "success",
//     data: {
//       stats: {
//         totalCompanies,
//         totalReviews,
//         averageComplaintRate: Number(averageComplaintRate),
//       },
//     },
//   });
// });
