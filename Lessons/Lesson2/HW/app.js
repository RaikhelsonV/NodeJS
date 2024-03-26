import color from './color.js';
import fruit from './fruit.js';
import logger from './lib/logger/logger.js';
import { add } from './math.js';

const log = logger.getLogger('webContext.js');
log.info(color);
log.warn(fruit);
log.error('ERROR occur: My log');
log.debug('Some debug data');
log.trace('Some trace data');
add(2, 5);