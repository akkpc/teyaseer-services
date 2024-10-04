import { Router } from "express";
const router = Router();

const axios = require('axios');

let oauthToken: string;
let tokenExpiryTime: number;

const generateToken = async () => {
    try {
        const { SALESFORCE_API, SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_USERNAME, SALESFORCE_PASSWORD } = process.env;
        const response = await axios.post(`${SALESFORCE_API}/services/oauth2/token`, {
            grant_type: 'password',
            client_id: SALESFORCE_CLIENT_ID,
            client_secret: SALESFORCE_CLIENT_SECRET,
            username: SALESFORCE_USERNAME,
            password: SALESFORCE_PASSWORD,
        });

        oauthToken = response.data.access_token;
        tokenExpiryTime = Date.now() + (response.data.expires_in * 1000);

        console.log("New Token Generated:", oauthToken);
    } catch (error) {
        console.error("Error generating token:", error);
    }
};

const isTokenExpired = () => {
    return !oauthToken || Date.now() > tokenExpiryTime;
};

const getToken = async () => {
    if (isTokenExpired()) {
        await generateToken();
    }
    return oauthToken;
};


// List companies
router.get("/test_token", async (req, res) => {
    const token = await getToken();
    return res.send({
        token: token
    })
});

export { router as SalesforceRouter };
