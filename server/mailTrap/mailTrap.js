import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // Use the actual path to your .env

import nodemailer from "nodemailer";


export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), 
  secure: process.env.SMTP_PORT == "465", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send emails.");
  }
});