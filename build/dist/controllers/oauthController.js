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
exports.oauthCallback = exports.getAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let cachedToken = null;
const getAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_TENANT_ID } = process.env;
    if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_TENANT_ID) {
        throw new Error('OAuth credentials are missing in environment variables');
    }
    if (cachedToken && cachedToken.expiry > Date.now()) {
        return cachedToken.token;
    }
    try {
        const response = yield axios_1.default.post(`https://login.microsoftonline.com/${OAUTH_TENANT_ID}/oauth2/v2.0/token`, new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: OAUTH_CLIENT_ID,
            client_secret: OAUTH_CLIENT_SECRET,
            scope: 'https://graph.microsoft.com/.default',
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const accessToken = response.data.access_token;
        const expiresIn = response.data.expires_in;
        cachedToken = {
            token: accessToken,
            expiry: Date.now() + expiresIn * 1000 - 60000,
        };
        return accessToken;
    }
    catch (error) {
        console.error('Error fetching access token:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error('Failed to obtain access token');
    }
});
exports.getAccessToken = getAccessToken;
const oauthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield (0, exports.getAccessToken)();
        console.log('Access Token:', accessToken);
        res.send('Authorization successful. Access token obtained.');
    }
    catch (error) {
        console.error('Error in OAuth callback:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
exports.oauthCallback = oauthCallback;
