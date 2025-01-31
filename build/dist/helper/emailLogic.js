"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailWithRetry = void 0;
const axios_1 = __importDefault(require("axios"));
const oauthController_1 = require("../controllers/oauthController");
const sendEmailWithRetry = (recipient_1, subject_1, htmlContent_1, ...args_1) => __awaiter(void 0, [recipient_1, subject_1, htmlContent_1, ...args_1], void 0, function* (recipient, subject, htmlContent, retries = 3) {
    let attempt = 0;
    while (attempt < retries) {
        try {
            const accessToken = yield (0, oauthController_1.getAccessToken)();
            const emailData = {
                message: {
                    subject,
                    body: {
                        contentType: 'HTML',
                        content: htmlContent,
                    },
                    toRecipients: [
                        {
                            emailAddress: { address: recipient },
                        },
                    ],
                    from: {
                        emailAddress: {
                            address: process.env.EMAIL_USERNAME,
                            name: 'LinkOrg Networks',
                        },
                    },
                },
                saveToSentItems: 'false',
            };
            // Send email via Microsoft Graph API
            yield axios_1.default.post(`https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USERNAME}/sendMail`, emailData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Email sent successfully');
            return;
        }
        catch (error) {
            attempt++;
            console.error(`Attempt ${attempt}: Failed to send email - ${error.message}`);
            if (attempt >= retries) {
                console.error(`Failed to send email after ${retries} attempts`);
                throw new Error('Failed to send email after multiple attempts');
            }
            console.log(`Retrying email sending... Attempt ${attempt + 1}`);
        }
    }
});
exports.sendEmailWithRetry = sendEmailWithRetry;
