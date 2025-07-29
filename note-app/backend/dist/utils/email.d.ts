interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export declare const generateOTP: () => string;
export declare const sendOTPEmail: (email: string, otp: string) => Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map