const config = {
    rateLimits: {
        user: {
            limit: 25,
            duration: 20
        },
        url: {
            limit: 4,
            duration: 20
        }
    }
};
export default config;
