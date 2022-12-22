//import express from "express"
import express from "express"

const app = express()

import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import relationshipRoutes from "./routes/relationship.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import multer from "multer"

//middlewares - enable JSon form forms
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next() //continue with operations , allow cookies
})
app.use(express.json())

app.use(express.static("dist"))

// app.use(cors({
//     origin: "http://localhost:5173",
// }))   

// onlt localhost 8080
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, Date.now() + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

  app.post("/api/upload", upload.single("file"), (req,res)=> {
    const file = req.file
    res.status(200).json(file.filename)
  })


app.use("/api/auths", authRoutes) 
app.use("/api/users", userRoutes) 
//whenever cisit /api/users, will automatically go to userRoutes
//we will have a different end point /api/users/test

app.use("/api/posts", postRoutes) 
app.use("/api/comments", commentRoutes) 
app.use("/api/likes", likeRoutes) 
app.use("/api/relationships", relationshipRoutes)
//whenever cisit /api/users, will automatically go to userRoutes
//we will have a different end point /api/users/test

//allow any Json file using client

//  const corsOptions = {
//      origin: 'http://localhost:5173',
//        credentials: true,
//      ///..other options
//  };
//  app.use(cors(corsOptions))

//app.use(cookieParser());
//app.use(cors())

// app.use(Express.json())
// app.use(cookieParser())

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '../client/public/upload') //need to create this folder first
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now()+file.originalname) //use Date.now() to make the file name unique, so upload the sam efile name won't overwrite the old file
//     }
//   })
  
//   const upload = multer({ storage: storage })// same as 


//can load file to uploads folder on backend, but no picture file extension  - 
//const upload = multer({dest : './uploads/'})

// //app.post('/api/uploads/', upload.single('a')

// app.post('/api/upload', upload.single('file'), function (req, res) {
//     const file = req.file
//     res.status(200).json(file.filename)
    // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
//   })

// app.use("/api/auth", authRoutes)
// app.use("/api/users", userRoutes)
// app.use("/api/posts", postRoutes)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`port ${port} connected.`)
})