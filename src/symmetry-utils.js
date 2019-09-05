/**
 * ISC License (ISC)
 *
 * Copyright 2019 DrewRobinson <hello@drewrobinson.com>
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose with or without fee is hereby granted, provided
 * that the above copyright notice and this permission notice appear
 * in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */


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