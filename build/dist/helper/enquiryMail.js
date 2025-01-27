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
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryMail = void 0;
const emailLogic_1 = require("./emailLogic");
const enquiryMail = (recipient, name) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'Your Enquiry Has Been Received';
    const htmlContent = `
    <!DOCTYPE html>
<html>  
    <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333; padding: 20px; margin: 0;">  
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 5px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">  
            <h2 style="color: #333333; font-size: 24px; margin-bottom: 10px;">Enquiry Received</h2>  
            <p>Dear ${name},</p>  
            <p>Thank you for reaching out to Linkorg Networks. Your enquiry has been successfully received.</p>  
            <p>Our team will review your request and get back to you shortly.</p>  
            <p>If you have any urgent concerns, please feel free to contact us directly.</p>  
            <p>Thank you for trusting Linkorg Networks!</p>  
        </div>  
    </body>  
</html>
  `;
    yield (0, emailLogic_1.sendEmailWithRetry)(recipient, subject, htmlContent, 3);
});
exports.enquiryMail = enquiryMail;
