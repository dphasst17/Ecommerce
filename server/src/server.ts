import compression from "compression"
import express from "express";
import rateLimit from "express-rate-limit";

import productRoute from "./routes/product";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import orderRoute from "./routes/order"
import cartRoute from "./routes/cart"
import postRoute from "./routes/posts"
import commentRoute from "./routes/comment"
import statisticalRoute from "./routes/statistical"
import tableRoute from "./routes/table"

import AWS from "aws-sdk";
import fs from "fs";
import fileUpload from "express-fileupload";

const app = express();
const port = process.env.PORT || 3030;

/*const redis = new Redis({
  host: process.env.HOST_REDIS,
  port: Number(process.env.PORT_REDIS),
});

redis.ping((err, result) => {
  if (err) {
    console.error('Failed to connect to Redis:', err);
  } else {
    console.log('Connected to Redis:', result);
  }
  redis.quit();
});*/
/* db.connect(); */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: Number(process.env.LIMIT_REQ),
  handler: function (req, res) {
    res.status(429).send({
      status: 500,
      message: 'Too many requests!',
    });
  },
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const date = new Date().toISOString();
    const status = res.statusCode;
    console.log(`[${date}] ${status} - ${duration}ms ${req.method} - ${req.originalUrl}`);
  });
  next();
});



app.use(express.json());
app.use(compression());

AWS.config.update({ region: "ap-southeast-1" });
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_KEY!,
    secretAccessKey: process.env.AWS_SKEY!,
  },
});
app.post("/upload/:folder", async (req, res) => {
  const files: any = req.files;
  const folder = req.params["folder"];

  for (let fileKey in files) {
    let file = files[fileKey];
    const fileData = fs.readFileSync(file.tempFilePath);
    const uploadParams = {
      Bucket: "express-image-upload",
      Key: folder + "/" + file.name,
      Body: fileData,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    try {
      const data = await s3.upload(uploadParams).promise();
      console.log("Upload Success", file.name);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  res.status(201).json({ message: "All files uploaded successfully" });
});


app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "Hello World!" });
});
app.use('/api/product', productRoute)
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/order', orderRoute)
app.use('/cart', cartRoute)
app.use('/post', postRoute)
app.use('/comment', commentRoute)
app.use('/api/statistical', statisticalRoute)
app.use('/api/table', tableRoute)

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});