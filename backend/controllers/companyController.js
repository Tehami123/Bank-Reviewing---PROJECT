const Company = require("../model/companyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCompanies = catchAsync(async (req, res, next) => {
  const companies = await Company.find().sort({ name: 1 });
  res.status(200).json({
    status: "success",
    results: companies.length,
    data: {
      companies,
    },
  });
});

// exports.getCompaniesAllStats = catchAsync(async (req, res, next) => {
//   const { sort, page = 1, limit = 10, search = "" } = req.query;

//   const pageNumber = parseInt(page);
//   const limitNumber = parseInt(limit);
//   const skip = (pageNumber - 1) * limitNumber;

//   // fetch all companies
//   let AllCompanies = Company.find({
//     name: { $regex: search, $options: "i" },
//   }).lean();

//   // calculate complaint rate manually
//   AllCompanies = await AllCompanies.map((company) => {
//     const { negativeCount, totalReviews } = company;
//     const complaintRate =
//       totalReviews === 0
//         ? 0
//         : parseFloat(((negativeCount / totalReviews) * 100).toFixed(2));
//     return {
//       ...company,
//       complaintRate,
//     };
//   });

// //   sort based on the query 

// switch (sort) {
//     case "review_asc":
//         AllCompanies.sort((a,b)=>a.totalReviews - b.totalReviews)
//         break;
//     case"review_desc":
//     AllCompanies.sort((a,b)=> b.totalReviews - a.totalReviews)
//     break;
//     case "complaints_asc":
//         AllCompanies.sort((a,b)=>a.complaintRate - b.complaintRate)
//         break;
//         case"complaints_desc":
//         AllCompanies.sort((a,b)=> b.complaintRate - a.complaintRate )
//         break;
//         default:
//             AllCompanies.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
//             break; 
// }


//     //  get total companies
//     const totalCompanies = AllCompanies.length;
//     const totalPages = Math.ceil(totalCompanies/limitNumber)

//     //  pagination
//     const paginatedCompanies  = AllCompanies.slice(skip,skip+limitNumber);

//     // send the response
//     res.status(200).json({
//         status:"success",
//         totalCompanies,
//         totalPages,
//         currentPage:pageNumber,
//         count:paginatedCompanies.length,
//         data:{
//             companies:paginatedCompanies,
//         }
//     })
// });
exports.getCompaniesAllStats = catchAsync(async (req, res, next) => {
  const { sort, page = 1, limit = 10, search = "" } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // ✅ Await the query properly
  let AllCompanies = await Company.find({
    name: { $regex: search, $options: "i" },
  }).lean();

  // ✅ Now map will work
  AllCompanies = AllCompanies.map((company) => {
    const { negativeCount, totalReviews } = company;
    const complaintRate =
      totalReviews === 0
        ? 0
        : parseFloat(((negativeCount / totalReviews) * 100).toFixed(2));
    return {
      ...company,
      complaintRate,
    };
  });

  // ✅ Sorting logic
  switch (sort) {
    case "review_asc":
      AllCompanies.sort((a, b) => a.totalReviews - b.totalReviews);
      break;
    case "review_desc":
      AllCompanies.sort((a, b) => b.totalReviews - a.totalReviews);
      break;
    case "complaints_asc":
      AllCompanies.sort((a, b) => a.complaintRate - b.complaintRate);
      break;
    case "complaints_desc":
      AllCompanies.sort((a, b) => b.complaintRate - a.complaintRate);
      break;
    default:
      AllCompanies.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      break;
  }

  const totalCompanies = AllCompanies.length;
  const totalPages = Math.ceil(totalCompanies / limitNumber);
  const paginatedCompanies = AllCompanies.slice(skip, skip + limitNumber);

  res.status(200).json({
    status: "success",
    totalCompanies,
    totalPages,
    currentPage: pageNumber,
    count: paginatedCompanies.length,
    data: {
      companies: paginatedCompanies,
    },
  });
});


exports.getCompanyById = catchAsync(async (req,res,next) => {
    const {id} = req.params;

    const company = await Company.findById(id).populate({
        path:'reviews'
    }).lean();

    if(!company) return next(new AppError("No company Found",404))
    
        const {totalReviews,negativeCount} = company

    const complaintRate =
      totalReviews === 0
        ? 0
        : parseFloat(((negativeCount / totalReviews) * 100).toFixed(2));
    

        const companyWithStats = {
            ...company,
            complaintRate,
        };
        res.status(200).json({
            status:"success",
            message:"Company Details",
            data:{
                company:companyWithStats,
            }
        })
})














// exports.getCompaniesAllStats = catchAsync(async (req, res, next) => {
//   const { sort, page = 1, limit = 10, search = "" } = req.query;

//   const pageNumber = parseInt(page);
//   const limitNumber = parseInt(limit);
//   const skip = (pageNumber - 1) * limitNumber;

//   // ✅ Await the query and fix $options typo
//   let AllCompanies = await Company.find({
//     name: { $regex: search, $options: "i" },
//   }).lean();

//   // ✅ Now map works
//   AllCompanies = AllCompanies.map((company) => {
//     const { negativeCount, totalReviews } = company;
//     const complaintRate =
//       totalReviews === 0
//         ? 0
//         : parseFloat(((negativeCount / totalReviews) * 100).toFixed(2));
//     return {
//       ...company,
//       complaintRate,
//     };
//   });

//   // Sorting
//   switch (sort) {
//     case "review_asc":
//       AllCompanies.sort((a, b) => a.totalReviews - b.totalReviews);
//       break;
//     case "review_desc":
//       AllCompanies.sort((a, b) => b.totalReviews - a.totalReviews);
//       break;
//     case "complaints_asc":
//       AllCompanies.sort((a, b) => a.complaintRate - b.complaintRate);
//       break;
//     case "complaints_desc":
//       AllCompanies.sort((a, b) => b.complaintRate - a.complaintRate);
//       break;
//     default:
//       AllCompanies.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       break;
//   }

//   const totalCompanies = AllCompanies.length;
//   const totalPages = Math.ceil(totalCompanies / limitNumber);
//   const paginatedCompanies = AllCompanies.slice(skip, skip + limitNumber);

//   res.status(200).json({
//     status: "success",
//     totalCompanies,
//     totalPages,
//     currentPage: pageNumber,
//     count: paginatedCompanies.length,
//     data: {
//       companies: paginatedCompanies,
//     },
//   });
// });
