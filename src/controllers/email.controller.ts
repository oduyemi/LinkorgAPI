import { Request, Response } from "express";
import { getAccessToken } from "./oauthController";
import { sendEmailWithRetry } from '../helper/emailSample'; 
import Email, {IEmail} from '../models/email.model'; 
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getAllInboxEntries = async (req: Request, res: Response): Promise<void> => {
  try {

    const accessToken = await getAccessToken();


    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const inboxEntries = response.data.value;

    for (const entry of inboxEntries) {
      const { from, subject, receivedDateTime, bodyPreview } = entry;

      const emailRecord = new Email({
            email: from.emailAddress.address,
            subject,
            name: from.emailAddress.name,
            message: bodyPreview, 
            sentAt: new Date(receivedDateTime),
            folder: 'Inbox',
      });

      await emailRecord.save();
    }


    res.status(200).json(inboxEntries);
  } catch (error: any) {
    console.error("Error fetching inbox entries:", error.response?.data || error.message);
    
    res.status(500).json({ message: "Error fetching inbox entries" });
  }
};


export const getInboxEntryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const accessToken = await getAccessToken();

        const response = await axios.get(
            `https://graph.microsoft.com/v1.0/me/messages/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error: any) {
        console.error("Error fetching inbox entry:", error.message);
        res.status(500).json({ message: "Error fetching inbox entry" });
    }
};

//     try {
//         const accessToken = await getAccessToken();

//         const response = await axios.get(
//             `https://graph.microsoft.com/v1.0/me/mailFolders/SentItems/messages`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             }
//         );

//         res.status(200).json(response.data.value);
//     } catch (error: any) {
//         console.error("Error fetching sent emails:", error.message);
//         res.status(500).json({ message: "Failed to fetch sent emails" });
//     }
// };

export const getAllSentEmails = async (req: Request, res: Response): Promise<void> => {
    try {
      const sentEmails: IEmail[] = await Email.find().exec();
  
      if (sentEmails.length === 0) {
        res.status(404).json({ message: "No sent emails found" });
        return;
      }

      res.status(200).json(sentEmails);
    } catch (error: any) {
      console.error("Error fetching sent emails from the database:", error.message);
      
      res.status(500).json({ message: "Failed to fetch sent emails. Please try again later." });
    }
  };

  export const getSentEmailById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const email: IEmail | null = await Email.findById(id);

        if (!email) {
            res.status(404).json({ message: "Email not found" });
            return;
        }

        res.status(200).json(email);
    } catch (error) {
        console.error("Error fetching email by ID:", error);
        res.status(500).json({ message: "Failed to fetch email" });
    }
};



export const sendEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, subject, name = "LinkOrg Networks LTD", message } = req.body;

    if (![email, subject, message].every((field) => !!field)) {
      res.status(400).json({ message: "All fields (email, subject, message) are required" });
      console.log("Request Body:", req.body);
      return;
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
      res.status(400).json({ message: "Invalid data types. Fields must be strings." });
      console.log("Request Body:", req.body);
      return;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2c3e50;">Hello ${name},</h2>
        <p>${message}</p>
        <p>Best regards,<br>LinkOrg NetworksTeam</p>
      </div>
    `;

    await sendEmailWithRetry(email, subject, htmlContent);

    const emailRecord = new Email({ email, subject, name, message, folder: 'Sent', });
    await emailRecord.save();

    res.status(200).json({ message: "Email sent and logged successfully!", emailRecord });
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ message: "Failed to send email. Please try again later." });
  }
};
