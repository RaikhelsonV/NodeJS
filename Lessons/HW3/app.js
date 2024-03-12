import color from './color.js';
import fruit from './fruit.js';
import logger from './lib/logger/logger.js';
import { add } from './math.js';

const log = logger.getLogger('app.js');
log.info(color);
log.warn(fruit);
log.error('occur: My log');
log.debug('Some debug data');
log.trace('Some trace data', 'Data', 'User');
add(2, 5);
