import { transporter } from "./mailTrap.js";

export const sendVerificationEmail = async (email,token) => {
  if(!email||!email.includes('@')){
    throw new error("invalid email address")
  }
  try {
    const res = await transporter.sendMail({
      rom: process.env.SMTP_USER, 
      to:email,
      subject: 'Verify your email',
      category: 'Email Verification',
      text:`please verify your email using this code:${token}`,
      html:`<p> please verify you email using this code:${token}<p>`
    });
    return res; // Optionally return response for further handling
  } catch (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};
export const welcomeMessageEmail = async (email, fullName) => {
  try {
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email address");
    }

    const mailOptions = {
      from: process.env.SMTP_USER, // Ensure sender is defined in .env
      to: email,
      subject: "Welcome to the Restaurant",
      text: `${fullName}, welcome to our restaurant!`,
      html: `<p>${fullName}, welcome to our restaurant.</p>`,
    };

    const res = await transporter.sendMail(mailOptions);
    console.log("Email sent:", res.messageId);
    return res;
  } catch (error) {
    console.error("Failed to send welcome message:", error.message);
    throw new Error(`Failed to send welcome message: ${error.message}`);
  }
};


export const sendPasswordEmail = async(email,resetUrl)=>{
  try {
    if(!email||!email.includes('@')){
      throw new error("invalid email address")
    }
    const res = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Reset you password',
      category: 'Reset Password',
      text: `You can reset your password by clicking the following link: ${resetUrl}`,
      html: `<p>You can reset your password by clicking the following link: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });
    return res; // Optionally return response for further handling
  } catch (error) {
    throw new Error(`Failed reset password message: ${error.message}`);
  }
};


export const sendPasswordResetSuccessEmail = async(email)=>{
  const recipient = [{ email }]; // Define recipient as an array of objects
  try {
    if(!email||!email.includes('@')){
      throw new error("invalid email address")
    }
    const res = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recipient,
      subject: 'Password reset successfully',
      category: 'Reset Password',
    });
    return res; // Optionally return response for further handling
  } catch (error) {
    throw new Error(`password not reset message: ${error.message}`);
  }
};


