// Include modules:-
// -----------------------------------------------------------------
const express = require("express")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const passport = require("passport")
const path = require("path")
const compression = require("compression")
const fileUpload = require("express-fileupload")
const cors = require("cors")

// Controllers:-
const errorController = require("./controllers/errorController")

// Routers:-
const authenticationRouter = require("./routes/authenticationRoutes")
const userRouter = require("./routes/userRoutes")
const courseRouter = require("./routes/courseRoutes")

// Globals:-
// -----------------------------------------------------------------
const app = express()

// Middlewares:-
// -----------------------------------------------------------------
// Limit requests ( 1] max: limits 1000 requests for each IP in one hour. | 2] windowMs: If the IP exceeds this limit then it would have to wait for an hour to pass. )
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: {
    status: "fail",
    message: "Too many requests from this IP. please try again in an hour.",
  },
})
app.use("/api", limiter)

// Prevent parameter pollution (prevents duplicate query string parameters & duplicate keys in urlencoded body requests)
// Add a second HPP middleware to apply the whitelist only to this route. e.g: app.use('/search', hpp({ whitelist: [ 'filter' ] }));
app.use(hpp())

// Middleware for debugging [Displays each incoming request in the console]
// if (process.env.NODE_ENV === "development")
app.use(morgan("dev"))

// using cors in development
if (process.env.NODE_ENV === "development") app.use(cors())

// Reading data from the body of the request as json and converting it to javascript object into req.body
app.use(express.json({ limit: "10kb" }))

// Data sanitization against NoSQL injection attacks.
// //but before using it, whitelist some parameters
// app.use((req,res,next)=>{
// 	if(req.query['generalProduct.productName'])
// 	{
// 		req.query_whitelist = {
// 			'generalProduct.productName': req.query['generalProduct.productName']
// 		};
// 	}
// 	next();
// })
app.use(mongoSanitize({}))

// Data sanitization against XSS(cross-site scripting) attacks.
app.use(xss())

// Passport Configuration
require("./config/passportConfig")(passport)
app.use(passport.initialize()) // This line must be put if we are using sessions with passport so not necessary in our app but i'll put it anyways.

// Compress responses before sending it.
app.use(compression())

// Upload Files.
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
)

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    res.setHeader("Access-Control-Allow-Origin", "*")
  } else {
    res.setHeader("Access-Control-Allow-Origin", "http://www.elearning.com")
  }
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization")
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition")
  res.setHeader("Access-Control-Allow-Methods", "*")
  next()
})
// Serve static files

// Frontend
const frontendPath = path.join(__dirname, process.env.FRONTEND_BUILD_LOCATION)
app.use(express.static(frontendPath))

// Public Folder
const publicFolderPath = path.join(__dirname, process.env.PUBLIC_FOLDER)
app.use(express.static(publicFolderPath))

const apiUrlBase = `${process.env.API_URL_PREFIX}/v${process.env.API_VERSION}`

app.use(`${apiUrlBase}/auth`, authenticationRouter)
app.use(`${apiUrlBase}/users`, userRouter)
app.use(`${apiUrlBase}/courses`, courseRouter)

app.get(/.*/, function (req, res) {
  res.sendFile(`${frontendPath}/index.html`)
})

app.use(errorController)

module.exports = app
