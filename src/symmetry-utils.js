/**
 * Responsible for logging messages to console
 * @returns {Logger}
 * @constructor
 */
function Logger(){
  return function Logger(message){
    if(typeof message !== "string" && message.length < 1){
      return
    }

    if(window && window.hasOwnProperty('DEBUG_SYMMETRY') && window.DEBUG_SYMMETRY){
      console.warn(message);
    }

    if(process && process.env.hasOwnProperty('DEBUG_SYMMETRY') && process.env.DEBUG_SYMMETRY.toLowerCase() === 'true'){
      console.warn(message);
    }
  };
}

/**
 * Responsible for generating random hash string
 * @returns {Hash}
 * @constructor
 */
function Hash() {
  return function Hash(){
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4());
  };
}

const logger = new Logger();
const hashKey = new Hash();

export { logger, hashKey }