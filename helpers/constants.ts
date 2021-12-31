export const API_URL = 'https://api.vendetunave.co/admin';
export const PUBLIC_URL = 'https://api.vendetunave.co/api';
export const AUTH_URL = 'https://api.vendetunave.co/auth';
export const S3_URL = 'https://d3bmp4azzreq60.cloudfront.net/fit-in/2500x2500/vendetunave/images';
export const FILES_URL = 'https://vendetunave.s3.amazonaws.com/vendetunave';

import cookie from "cookie";

const parseCookies = (req) => {
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export const validateAuth = ({ req, res }) => {
    const auth = parseCookies(req);
    return auth;
}