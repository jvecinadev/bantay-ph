
export const env = {
    port: process.env.PORT || 5000,
    jwt: process.env.JWT_SECRET as string,
    expdate: process.env.JWT_EXPIRES_IN as string,
    authCookieName: process.env.COOKIE_NAME as string,
    clientUrl: process.env.CLIENT_URL as string,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string
}