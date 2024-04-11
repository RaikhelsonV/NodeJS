const config = {
    rateLimits: {
        user: {
            limit: 3,
            duration: 20
        },
        url: {
            limit: 10,
            duration: 20
        }
    }
};
export default config;
