require("dotenv").config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cors({
    origin:process.env.UI_BASE_URL,
    credentials:true
}));
app.use(cookieParser())



app.get("/api/health",(req,res) => {
    res.status(200).send("The app is healthy!!");
})
app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api", require("./routes/catalogRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((error, req, res, next) => {
    console.error(error);
    return res.status(error.status || 500).json({ message: "Internal server error" });
});


async function connectDb(){
    try{
        let connectionString = process.env.MONGO_CONSTRING;
        await mongoose.connect(connectionString);
        console.log("Connected to db");
    }
    catch(error)
    {
        console.error("Error connecting to mongo db: "+error)
    }
}

async function startServer(port){
    try{
        await connectDb();
        await app.listen(port,() => {
            console.log(`Shop.co backend server started on port ${port} !!!`);

        } )
    }catch(error){
        console.error("error starting server"+error);
    }
}
 startServer(process.env.PORT || process.env.port || 5000).then(() => console.log("Server started successfully!!")).catch((error) => console.error("Error starting server: "+error));