import axios from "axios";
import { Router } from "express";
import querystring from "querystring"

const router = Router();

router.get("/auth/:code", async (req, res, next) => {
    const { code } = req.params;
    const { UAE_PASS_STG_URL, USER_NAME, PASSWORD, WEB_APP_URL } = process.env;
    const authUrl = `${UAE_PASS_STG_URL}/idshub/token`
    const params = querystring.stringify({
        'grant_type': 'authorization_code',
        'redirect_uri': `${WEB_APP_URL}/redirect`,
        'code': code,
    })

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    const response = await axios.post(authUrl, params, {
        headers,
        auth: {
            username: USER_NAME || "",
            password: PASSWORD || ""
        }
    }).then((res) => res.data).catch((err) => {
        console.log("Failed to fetch from staging url" + err)
    })
    if (response) {
        const newResponse: any = await axios.post(`${UAE_PASS_STG_URL}/idshub/userinfo`, params, {
            headers: {
                "Authorization": `Bearer ${response.access_token}`
            }
        }).then((res) => res.data).catch((err) => {
            console.log("Failed to fetch from staging url" + err)
        })

        return res.status(200).send({
            status: "success",
            data: newResponse
        })
    }
    return res.status(400).send({
        status: "error",
        error: "Internal server error"
    })
});

export { router as UAEPassRouter };
