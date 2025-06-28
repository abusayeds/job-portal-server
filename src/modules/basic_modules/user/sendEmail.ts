/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { Nodemailer_GMAIL, Nodemailer_GMAIL_PASSWORD } from "../../../config";

export const sendEmail = async (otp: any, email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: Nodemailer_GMAIL,
      pass: Nodemailer_GMAIL_PASSWORD,
    },
  });
  const emailContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; padding: 20px;">
    <h1 style="text-align: center; color: #452778; font-family: 'Times New Roman', Times, serif;">
      Abu<span style="color:black; font-size: 0.9em;">Sayed Server</span>
    </h1>
    <div style="background-color: white; padding: 20px; border-radius: 5px;">
      <h2 style="color:#d3b06c">Hello Dear !</h2>
      <p>You are receiving this email because we received a password reset request for your account.</p>
      <div style="text-align: center; margin: 20px 0;">
        <h3>Your OTP is: <strong>${otp}</strong></h3>
      </div>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you did not request a password reset, no further action is required.</p>
      <p>Regards,<br>Abu Sayed Server Team</p>
    </div>
    <p style="font-size: 12px; color: #666; margin-top: 10px;">If you're having trouble copying the OTP, please try again.</p>
  </div>
`;
  const receiver = {
    from: "khansourav58@gmail.com",
    to: email,
    subject: "Reset Password OTP",
    html: emailContent,
  };

  await transporter.sendMail(receiver);
}

export const forgotOtpEmail = async (otp: any, email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: Nodemailer_GMAIL,
      pass: Nodemailer_GMAIL_PASSWORD,
    },
  });
  const emailContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; padding: 20px;">
  <h1 style="text-align: center; color: #452778; font-family: 'Times New Roman', Times, serif;">
    Reset Your Password
  </h1>
  <div style="background-color: white; padding: 20px; border-radius: 5px;">
    <h2 style="color:#d3b06c;">Hello dear</h2>
    <p>You are receiving this email because we received a password reset request for your account.</p>
    <p>Please enter the following code to reset your password. The code will expire in 10 minutes.</p>
    <div style="text-align: center; margin: 20px 0;">
      <h3>Your verification code: <strong style="font-size: 24px; color: #4e5b6e;">${otp}</strong></h3>
    </div>
    <p>If you did not request a password reset, no further action is required.</p>
    <p>If you need further assistance, please contact our customer service center at <a href="mailto:support@kdanmobilesupport.zendesk.com">support@kdanmobilesupport.zendesk.com</a>.</p>
    <p style="font-size: 12px; color: #666; margin-top: 10px;">Copyright © 2019 Kdan Mobile, All rights reserved.</p>
  </div>
  <div style="text-align: center; margin-top: 20px;">
    <img src="https://cdn.jsdelivr.net/gh/yourusername/yourrepo@main/path/to/your-image.svg" alt="Verification Logo" width="100" style="display: block; margin: 0 auto;" />
  </div>
  <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">If you're having trouble copying the code, please try again.</p>
</div>


`;
  const receiver = {
    from: "khansourav58@gmail.com",
    to: email,
    subject: "Reset Password OTP",
    html: emailContent,
  };

  await transporter.sendMail(receiver);
}
export const resendOtpEmail = async (otp: any, email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: Nodemailer_GMAIL,
      pass: Nodemailer_GMAIL_PASSWORD,
    },
  });
  const emailContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; padding: 20px;">
  <h1 style="text-align: center; color: #452778; font-family: 'Times New Roman', Times, serif;">
    Prove Your  Identity
  </h1>
  <div style="background-color: white; padding: 20px; border-radius: 5px;">
    <h2 style="color:#d3b06c;">Hello dear</h2>
    <p>You are required to enter the following code to sign "Purchase Order" sent by Caroline Baby. Please enter the code in 10 minutes.</p>
    <div style="text-align: center; margin: 20px 0;">
      <h3>Your resend verification code: <strong style="font-size: 24px; color: #4e5b6e;">${otp}</strong></h3>
    </div>
    <p>If this wasn’t you, please ignore this email or contact our customer service center at <a href="mailto:support@kdanmobilesupport.zendesk.com">support@kdanmobilesupport.zendesk.com</a> for further assistance.</p>
    <p style="font-size: 12px; color: #666; margin-top: 10px;">Copyright © 2019 Kdan Mobile, All rights reserved.</p>
  </div>
  <div style="text-align: center; margin-top: 20px;">
    <img src="https://job-portal-sayed-server.sarv.live/images/f87bc56f-7eff-4a1b-be21-bde0a4e3e186.svg" alt="Verification Logo" width="100" />
  </div>
  <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">If you're having trouble copying the code, please try again.</p>
</div>

`;
  const receiver = {
    from: "khansourav58@gmail.com",
    to: email,
    subject: "Reset Password OTP",
    html: emailContent,
  };

  await transporter.sendMail(receiver);
}


export const sendRegistationOtpEmail = async (otp: any, email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: Nodemailer_GMAIL,
      pass: Nodemailer_GMAIL_PASSWORD,
    },
  });

  const emailContent = `
 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0; padding: 20px;">
  <h1 style="text-align: center; color: #452778; font-family: 'Times New Roman', Times, serif;">
    Welcome to Job portal!
  </h1>
  <div style="background-color: white; padding: 20px; border-radius: 5px;">
    <h2 style="color:#d3b06c;">Hello Dear</h2>
    <p>Thank you for registering with Job portal. We are excited to have you on board!</p>
    <p>To complete your registration, please enter the following verification code.</p>
    <div style="text-align: center; margin: 20px 0;">
      <h3>Your verification code: <strong style="font-size: 24px; color: #4e5b6e;">${otp}</strong></h3>
    </div>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not register for this account, please disregard this email.</p>
    <p>If you have any questions or need assistance, feel free to reach out to our customer support at <a href="mailto:support@kdanmobilesupport.zendesk.com">support@kdanmobilesupport.zendesk.com</a>.</p>
    <p style="font-size: 12px; color: #666; margin-top: 10px;">Copyright © 2019 Kdan Mobile, All rights reserved.</p>
  </div>
  <div style="text-align: center; margin-top: 20px;">
    <img src="https://job-portal-sayed-server.sarv.live/images/f87bc56f-7eff-4a1b-be21-bde0a4e3e186.svg" alt="Verification Logo" width="100" />
  </div>
  <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">If you're having trouble copying the code, please try again.</p>
</div>
`;

  const receiver = {
    from: "khansourav58@gmail.com",
    to: email,
    subject: "User Registation OTP ",
    html: emailContent,
  };

  await transporter.sendMail(receiver);
}





















// export const sendRegistationOtpEmail = async (otp: any, email: string) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     secure: true,
//     auth: {
//       user: Nodemailer_GMAIL,
//       pass: Nodemailer_GMAIL_PASSWORD,
//     },
//   });



//   const receiver = {
//     from: "khansourav58@gmail.com",
//     to: email,
//     subject: "Reset Password OTP",
//     html: emailContent,
//   };

//   await transporter.sendMail(receiver);
// }



