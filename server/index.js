// Start importing dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'; // Import mongoose correctly
import cors from 'cors';
// import { config } from 'dotenv';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js'
// First, we need to initialize it so,
const app = express();
dotenv.config();



// Setting up a body-parser so we can send req ..right!
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//it ia a middleware that tells the express application to use (userRoutes / postRoutes..) router for any incoming req that matches the 
//path(/user or /post or ....any)
app.use('/posts' , postRoutes);
app.use('/user' , userRoutes);

// config();
// Connecting to the database (cloud mongodb)
// const CONNECTION_URL =
//   'mongodb+srv://admin-abhishek:abhirobotna@cluster0.jd1i9dg.mongodb.net/?retryWrites=true&w=majority';

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));
