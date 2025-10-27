
const catchAsync = require("../utils/catchAsync");


// controllers/errorController.js
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};



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