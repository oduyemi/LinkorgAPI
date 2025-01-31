import { sendEmailWithRetry } from './emailLogic';

export const bookingMail = async (recipient: string, name: string): Promise<void> => {
  const subject = 'Thank You for Booking a Service with Linkorg Networks';
  const htmlContent = `
    <!DOCTYPE html>
<html>  
    <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; color: #333; padding: 20px; margin: 0;">  
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 5px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">  
            <h2 style="color: #333333; font-size: 24px; margin-bottom: 10px;">Booking Request Received</h2>  
            <p>Dear ${name},</p>  
            <p>Thank you for reaching out to Linkorg Networks. Your booking request has been successfully received.</p>  
            <p>Our team will review your request and get back to you shortly.</p>  
            <p>If you have any urgent concerns, please feel free to contact us directly.</p>  
            <p>Thank you for trusting Linkorg Networks!</p>  
        </div>  
    </body>  
</html>
  `;

  await sendEmailWithRetry(recipient, subject, htmlContent, 3);
};
