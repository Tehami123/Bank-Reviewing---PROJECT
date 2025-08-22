const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    
  name: { type: String, required: true, unique: true, trim: true },
  positiveCount: { type: Number, default: 0 },
  negativeCount: { type: Number, default: 0 },
  neutralCount: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "story" }],
  

},{timestamps:true});

module.exports= mongoose.model("Company",companySchema)
