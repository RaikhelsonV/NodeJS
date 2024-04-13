const config = {
    rateLimits: {
        user: {
            limit: 10,
            duration: 60
        },
        url: {
            limit: 10,
            duration: 60
        }
    }
};
export default config;
