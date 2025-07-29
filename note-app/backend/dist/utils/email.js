"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = exports.generateOTP = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Notes App" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${options.to}`);
    }
    catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
exports.sendEmail = sendEmail;
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const sendOTPEmail = async (email, otp) => {
    const subject = 'Your OTP for Notes App Verification';
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Notes App!</h2>
      <p>Thank you for signing up. Please use the following OTP to verify your email address:</p>
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
      </div>
      <p>This OTP will expire in 15 minutes. If you didn't request this verification, please ignore this email.</p>
      <p>Best regards,<br>Notes App Team</p>
    </div>
  `;
    const text = `Your OTP for Notes App verification is: ${otp}. This OTP will expire in 15 minutes.`;
    await (0, exports.sendEmail)({
        to: email,
        subject,
        text,
        html,
    });
};
exports.sendOTPEmail = sendOTPEmail;
//# sourceMappingURL=email.js.map