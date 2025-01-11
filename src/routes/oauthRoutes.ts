import express from "express";

import { oauthCallback } from '../controllers/oauthController';

const router = express.Router();


router.get('/oauth-callback', oauthCallback);

export default router;
