const catchAsync = require("../utils/catchAsync");
const Story = require("../model/reviewModel");
const AppError = require("../utils/appError");
const Company = require("../model/companyModel")
const crypto = require("crypto")

function generateAnonymousId (){
return "Anon-" + crypto.randomBytes(3).toString("hex")
}

exports.getAllReview = catchAsync(async (req, res, next) => {
  const {
    companyName = "",
    vibe = "",
    search = "",
    sort = "newest",
    page = 1,
    limit = 6,
  } = req.query;

  const filter = {};

  if (companyName) {
    filter.companyName = { $regex: companyName.trim(), $options: "i" };
  }
  if (vibe) {
    filter.vibe = vibe.trim().toLowerCase();
  }
  if (search) {
    filter.title = { $regex: search.trim(), $options: "i" };
  }

  const sortOptions = sort === "oldest" ? "createdAt" : "-createdAt";
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Story.find(filter).sort(sortOptions).skip(skip).limit(Number(limit)),
    Story.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    data: { reviews },
  });
});

exports.createStory = catchAsync(async (req, res, next) => {
  let { vibe, companyName, isAnonymous, name, userType, title, story } = req.body;

  if (!isAnonymous && (!name || !name.trim())) {
    return next(new AppError("Name is required when you're not anonymous", 400));
  }

  const company = await Company.findOne({ name: companyName.trim() });
  if (!company) {
    return next(new AppError("Please select a valid company from the list", 400));
  }

  vibe = (vibe || "").trim().toLowerCase();
  companyName = company.name.trim();

  const newStory = await Story.create({
    vibe,
    companyName,
    isAnonymous,
    name: isAnonymous ? undefined : name.trim(),
    anonymousId: isAnonymous ? generateAnonymousId() : undefined,
    userType,
    title,
    story,
  });

  const update = {
    $push: { reviews: newStory._id },
    $inc: { totalReviews: 1 },
  };

  if (vibe === "positive") update.$inc.positiveCount = 1;
  if (vibe === "negative") update.$inc.negativeCount = 1;
  if (vibe === "neutral") update.$inc.neutralCount = 1;

  await Company.findByIdAndUpdate(company._id, update);

  res.status(201).json({
    status: "success",
    message: "Story Submitted Successfully",
    data: { story: newStory },
  });
});



// exports.createStory = catchAsync(async (req,res,next) => {
//     const {vibe,companyName,isAnonymous,name,userType,title,story} = req.body;
//     if(!isAnonymous && name) {
//         return next(new AppError("name is required when Youre not Anonymous",400));
//     }
//     const company = await Company.findOne({
//         name:companyName.trim(),

//     });
//     if(!company) return next(new AppError("Please Select a valid company from the list",400))

//       const newStory = await Story.create({
//         vibe,companyName:company.name,isAnonymous,name:isAnonymous ? undefined :name,
//         anonymousId:isAnonymous?generateAnonymousId():undefined,
//         userType,
//         title,
//         story
//       });


//       const update = {
//         $push:{reviews:newStory._id},
//         $inc:{totalReviews:1},
//       };
      
//       if (vibe==='postive') update.$inc.postiveCount = 1;
//       if (vibe==='negative') update.$inc.negativeCount = 1;
//       if (vibe==='neutral') update.$inc.neutralCount = 1;

//       await Company.findByIdAndUpdate(company._id, update);

//       res.status(201).json({
//         status: "success",
//         message: "Story Submitted Successfully",
//         data: {
//           story: newStory,
//         },
//       });
      
// })

// exports.createStory = catchAsync(async (req, res, next) => {
//     const { vibe, companyName, isAnonymous, name, userType, title, story } = req.body;

//     // ✅ Corrected validation
//     if (!isAnonymous && (!name || !name.trim())) {
//         return next(new AppError("Name is required when you're not anonymous", 400));
//     }

//     const company = await Company.findOne({
//         name: companyName.trim(),
//     });

//     if (!company) {
//         return next(new AppError("Please select a valid company from the list", 400));
//     }

//     const newStory = await Story.create({
//         vibe,
//         companyName: company.name,
//         isAnonymous,
//         name: isAnonymous ? undefined : name.trim(),
//         anonymousId: isAnonymous ? generateAnonymousId() : undefined,
//         userType,
//         title,
//         story
//     });

//     const update = {
//         $push: { reviews: newStory._id },
//         $inc: { totalReviews: 1 },
//     };

//     if (vibe === 'positive') update.$inc.positiveCount = 1;
//     if (vibe === 'negative') update.$inc.negativeCount = 1;
//     if (vibe === 'neutral') update.$inc.neutralCount = 1;

//     await Company.findByIdAndUpdate(company._id, update);

//     res.status(201).json({
//         status: "success",
//         message: "Story Submitted Successfully",
//         data: { story: newStory },
//     });
// });

