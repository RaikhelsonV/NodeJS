function formatMessage(date, level, category, message) {
    return `Date: ${date}, category: ${category}, level: ${level}, message: ${JSON.stringify(
        message
    )}`;
}

export { formatMessage };
