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

  // create a filter object
  const filter = {};

  if (companyName) {
    filter.companyName = { $regex: companyName, $options: "i" };
  }
  if (vibe) {
    filter.vibe = vibe;
  }
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const sortOptions = sort === "oldest" ? "createdAt" : "-createdAt";

  const skip = (page - 1) * limit;

  const { reviews, total } = await Promise.all([
    Story.find(filter).sort(sortOptions).skip(skip).limit(Number(limit)),
    Story.countDocuments(filter),
  ]);
  res.status(200).json({
    status:"success",
    results:reviews.length,
    total,
    page:Number(page),
    totalPages:Math.ceil(total/limit),
    data:{reviews},


  })
});


exports.createStory = catchAsync(async (req,res,next) => {
    const {vibe,companyName,isAnonymous,name,userType,title,story} = req.body;
    if(!isAnonymous && name) {
        return next(new AppError("name is required when Youre not Anonymous",400));
    }
    const company = await Company.findOne({
        name:companyName.trim(),

    });
    if(!company) return next(new AppError("Please Select a valid company from the list",400))

      const newStory = await Story.create({
        vibe,companyName:company.name,isAnonymous,name:isAnonymous ? undefined :name,
        anonymousId:isAnonymous?generateAnonymousId():undefined,
        userType,
        title,
        story
      });

      
})
