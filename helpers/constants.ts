export const API_URL = 'http://localhost:8000/admin';
export const PUBLIC_URL = 'http://localhost:8000/api';
export const AUTH_URL = 'http://localhost:8000/auth';
export const S3_URL = 'https://d3bmp4azzreq60.cloudfront.net/fit-in/250x250/vendetunave/images';
export const FILES_URL = 'https://vendetunave.s3.amazonaws.com/vendetunave';

import cookie from "cookie";

const parseCookies = (req) => {
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

export const validateAuth = ({ req, res }) => {
    const auth = parseCookies(req);
    return auth;
}