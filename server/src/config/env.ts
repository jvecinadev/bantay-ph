
export const env = {
    port: process.env.PORT || 5000,
    jwt: process.env.JWT_SECRET as string,
    expdate: process.env.JWT_EXPIRES_IN as string,
}