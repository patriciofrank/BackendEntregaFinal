import dotenv from 'dotenv'


dotenv.config({
    path: './.env'
})

export default {
    environment: environment,
    port: process.env.PORT,
    mongoURL: process.env.MONGODBURL,
    selectedDB: process.env.SELECTEDDB,
    signedCookie: process.env.SIGNED_COOKIE,
    sessionSecret: process.env.SESSION_SECRET,
    salt: process.env.SALT,
    appId: process.env.APP_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callBackUrl: process.env.CALLBACK_URL,
}