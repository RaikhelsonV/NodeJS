import logger from './lib/logger/logger.js';
const log = logger.getLogger('math.js');

function add(a, b) {
    log.info('First operand: ' + a);
    log.info('Second operand: ' + b);
    return a + b;
}

export { add };
