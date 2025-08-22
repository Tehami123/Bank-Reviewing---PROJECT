const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Company = require("../model/companyModel")
 

dotenv.config({path:"../config.env"})

// connect out database

const DB = process.env.DB_URL;

mongoose
  .connect(DB)
  .then(() => console.log("DB connection Succesful!"))
  .catch((error) => console.log(error));

  const banks = [
  // Public Sector Banks
  "National Bank of Pakistan",
  "Bank of Punjab",
  "Sindh Bank",
  "Bank of Khyber",
  "First Women Bank",
  "Zarai Taraqiati Bank Limited",
  "Industrial Development Bank of Pakistan",

  // Private Banks
  "Allied Bank Limited",
  "Askari Bank",
  "Bank Alfalah Limited",
  "Bank Al-Habib Limited",
  "Habib Bank Limited",
  "Habib Metropolitan Bank",
  "JS Bank Limited",
  "MCB Bank Limited",
  "Soneri Bank",
  "Standard Chartered Bank (Pakistan)",
  "United Bank Limited",
  "Summit Bank Limited",
  "Silk Bank Limited",
  "Samba Bank Limited",
  "S.M.E. Bank Limited",

  // Islamic Banks
  "Meezan Bank Limited",
  "Dubai Islamic Bank",
  "Al Baraka Bank (Pakistan) Limited",
  "BankIslami Pakistan Limited",
  "Faysal Bank (Islamic)",
  "Makramah Limited (BML)",
  "MCB Islamic Banking",
  "UBL Islamic Banking",
  "HBL Islamic Banking",
  "NBP Islamic Banking",
  "Bank Al Habib Islamic Banking",
  "Bank of Punjab Islamic Banking",
  "HabibMetro (Sirat Islamic Banking)",
  "Silk Bank (Emaan Islamic Banking)",
  "Soneri Mustaqeem Islamic Bank",
  "Bank Of Khyber (Islamic Window)",

  // Foreign Banks
  "Deutsche Bank AG",
  "Citi Bank N.A",
  "Industrial and Commercial Bank of China Limited",
  "Bank of China",
  "HSBC Bank Pakistan",
  "MUFG Bank Pakistan",
  "Saudi National Bank (Samba Bank Pakistan)",

  // Cooperative and Provincial Banks
  "Punjab Provincial Cooperative Bank Limited",
  "Bank of Azad Jammu and Kashmir"
];

const addCompanies = async () => {
    try {
        await Company.deleteMany();

        const formatted = banks.map((name)=>(
            {
                name:name.trim(),
                totalReviews:0,
                positiveCount:0,
                negativeCount:0,
                neutralCount:0,
                reviews:[],
            }
        ))
        await Company.insertMany(formatted);
        console.log("Companies Added SuccessFully!");
        process.exit()
        
    } catch (error) {
        console.log("Error Adding Companies",error);
        process.exit(1)
        
    }
}
const deleteCompanies = async () => {
    try {
        await Company.deleteMany();
        console.log("All Companies Deleted Successfully");
        process.exit()
        
    } catch (error) {
        console.log(error,"Error Deleting Companies");
        process.exit(1)
        
    }
}

const run = async () => {
    const arg = process.argv[2];

    if(arg === '--add'){
        await addCompanies();
    } else if(arg === '--delete'){
        await deleteCompanies();
    } else{
        console.log("Use --add to add company or --delete to delete company");
        process.exit(0);
        
    }

}

run();
// node companySeed.js --add to add company --delete to delete