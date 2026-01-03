const express = require("express");
const app = express();


// import routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require('./routes/Contact');



const database  = require("./config/DbConnect");
const cookieParser =  require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/Cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();
 

const PORT = process.env.PORT || 3000;

// database connect
database.dbConnect();

app.use(express.json());
app.use(cookieParser());
// Configure CORS to accept multiple allowed origins from env var `ALLOWED_ORIGINS`.
// Example: ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",").map(o => o.trim());

// log the allowed origins at startup to verify env parsing
console.log('Allowed origins:', allowedOrigins);
app.use(
    cors({
        origin: function(origin, callback){
                // debug log each incoming origin for CORS checks
                console.log('CORS check origin:', origin);
                // allow requests with no origin (like mobile apps, curl)
                if(!origin) return callback(null, true);
                if(allowedOrigins.indexOf(origin) !== -1){
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
        credentials: true,
    })
)


// file upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}));


// cloudinary
cloudinaryConnect();



// add/mount API Route
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute)



app.get("/", (req,res)=>{
    return res.json({
        success: true,
        message: "Your server is up and running...",
    });
})



app.listen(PORT, (req,res)=>{
    console.log(`App is running at ${PORT} port`)
})

