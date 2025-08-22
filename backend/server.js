const mongoose = require("mongoose");

const dotenv = require("dotenv");


process.on("uncaughtException",(err)=>{
    console.log(
        "Uncaught Excepton Shutting Down ..."

    );
    console.log(err.name,err.message,err.cause,err.stack);
    process.exit(1)
    
    
})

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DB_URL;

mongoose
  .connect(DB)
  .then(() => console.log("DB connection Succesful!"))
  .catch((error) => console.log(error));



const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

process.on("unhandledRejection",(err)=>{
    console.log(
        "Unhandle rejection! Shutting Down ..."

    );
    console.log(err.name,err.message);
    process.exit(1)
    
})
