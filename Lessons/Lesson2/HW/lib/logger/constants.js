const level = {
    TRACE: 'TRACE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

const scoreLevel = {
    [level.ERROR]: 1,
    [level.WARN]: 2,
    [level.INFO]: 3,
    [level.DEBUG]: 4,
    [level.TRACE]: 5,
};

const appender = {
    CONSOLE: 'CONSOLE',
    FILE: 'FILE',
};

const files = {
    LOG_FILE: 'logs/app.log',
    LOG_ERROR_FILE: 'logs/app_error.log',
};

export { level, scoreLevel, appender, files };
