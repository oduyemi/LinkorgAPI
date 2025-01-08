import { Request, Response } from 'express';
import axios from 'axios'; 
import dotenv from 'dotenv';

dotenv.config();


  
let cachedToken: { token: string; expiry: number } | null = null;

export const getAccessToken = async (): Promise<string> => {
  const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_TENANT_ID } = process.env;

  if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_TENANT_ID) {
    throw new Error('OAuth credentials are missing in environment variables');
  }

  if (cachedToken && cachedToken.expiry > Date.now()) {
    return cachedToken.token;
  }

  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${OAUTH_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    cachedToken = {
      token: accessToken,
      expiry: Date.now() + expiresIn * 1000 - 60000, 
    };

    return accessToken;
  } catch (error: any) {
    console.error('Error fetching access token:', error.response?.data || error.message);
    throw new Error('Failed to obtain access token');
  }
};


export const oauthCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const accessToken = await getAccessToken();
    console.log('Access Token:', accessToken);

    // Perform an action, such as sending a test email
    res.send('Authorization successful. Access token obtained.');
  } catch (error: any) {
    console.error('Error in OAuth callback:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

