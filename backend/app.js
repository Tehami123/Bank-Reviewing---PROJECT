const express = require("express");

const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const companyRouter = require("./routes/companyRoute")
const reviewRouter= require('./routes/reviewRoute')

const app = express();



app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
const limiter = rateLimit({
    windowMs:60 *60 * 1000, // it defines one hour
    max:10000,
    message:"Too Many Request From This IP Please Try Again in An Hour",
    standardHeaders:true,
    legacyHeaders:false,
})

app.use('/api',limiter);

if(process.env.NODE_ENV === 'development'){
app.use(morgan("dev"))
}

app.use(express.json({limit:"10kb"}));

app.use((req,res,next)=>{
    mongoSanitize.sanitize(req.body)
    mongoSanitize.sanitize(req.params)

    const queryCopy = {...req.query}

    mongoSanitize.sanitize(queryCopy);
    req.querySanitized = queryCopy


    next();
})

app.use('/api/v1/companies',companyRouter);
app.use('/api/v1/reviews',reviewRouter)


app.get('/',(req,res)=>{
    res.status(200).json({
        status:'success',
        message:"Just For Testing"
    })
})

app.use((req,res,next)=>{
    next(new AppError(`Cant Find ${req.originalUrl} on this Server`,404));

})
app.use(globalErrorHandler);

module.exports = app;
