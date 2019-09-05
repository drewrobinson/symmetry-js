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

import { logger } from "./symmetry-utils";

/**
 *
 * Represents Service Model
 * @author Drew Robinson
 */

class Model {
  constructor(service, updateMsg, errorMsg) {
    let self = this;
    self.service = service;
    self.data = {};
    self.MODEL_UPDATED = updateMsg;
    self.MODEL_ERROR = errorMsg;
    self.logger = logger;
  }

  /**
   * getData
   * @returns {*}
   */
  getData() {
    return this.data;
  }

  /**
   * setData
   */
  setData(data) {
    let self = this;

    if (!data) {
      throw new Error("Cannot set data");
    }

    let aux = Object.assign({}, data);
    self.data = null;
    self.data = Object.freeze(aux);
    self.service.bus.publish(self.MODEL_UPDATED, self.data);
  }

  /**
   * Responsible for publishing error message on service bus
   * @param errorObj
   */
  error(errorObj){
    let self = this;
    self.service.bus.publish(self.MODEL_ERROR, errorObj);
  }

  /**
   * Responsible for returning the responseBody based on content type
   * @param contentType {string}
   * @param response {}
   */
  readResponseBody(contentType, response){
    let _contentType = contentType || "";
    let responseBody;

    if(_contentType.indexOf('json') > -1){
      responseBody =  response.json();
    }

    if(_contentType.indexOf('text') > -1){
      responseBody =  response.text();
    }

    if(_contentType.indexOf('form') > -1){
      responseBody =  response.json();
    }

    if(!_contentType){
      responseBody =  response.json();
    }

    return responseBody;
  }

  /**
   * Responsible for returning boolean indicator to resolve or reject based on status code
   * @param status
   * @returns {boolean}
   */
  responseHandler(status){
    let resolve = true;
    //Error
    if(status >= 400){
      resolve = false;
    }

    //Redirect
    if (status >= 300) {
      resolve = true;
    }

    //Success
    if (status > 200) {
      resolve = true;
    }

    if(status === 200) {
      resolve = true
    }
    return resolve;
  }


  /**
   *
   * @param url
   * @returns {Promise}
   * @private
   */
  get(headers, url) {
    let self = this;
    let _promise = new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        cache: "no-cache",
        headers: headers,
        credentials: "same-origin"
      })
      .then(function(response) {
        const contentType = response.headers.get("content-type");
        const shouldResolve = self.responseHandler(response.status);
        if(shouldResolve){
          resolve(self.readResponseBody(contentType, response));
          return;
        }else{
          let aux = response.clone();
          reject({type:'GET Error', code:response.status, url:url, aux: aux});
          return;
        }
      })
      .catch(function(error) {
        self.error({type:'GET Error', error: error});
        self.logger("GET Error: " + error);
      });
    });

    _promise.catch(function(errorObj){
      let error = (Object.keys(errorObj).length > 0) ? errorObj : {error: errorObj.toString()};
      self.error(errorObj);
      self.logger('GET Promise Rejected. ' + JSON.stringify(error));
    })
    return _promise;
  }

  /**
   *
   * @param url
   * @param opts
   * @returns {Promise}
   * @private
   */
  post(headers, url, opts) {
    let self = this;
    let _promise = new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(opts),
        cache: "no-cache",
        headers: headers
      })
      .then(function(response) {
        const contentType = response.headers.get("content-type");
        const shouldResolve = self.responseHandler(response.status);
        if(shouldResolve){
          resolve(self.readResponseBody(contentType, response));
          return;
        }else{
          let aux = response.clone();
          reject({type:'GET Error', code:response.status, url:url, aux: aux});
          return;
        }
      })
      .catch(function(error) {
        self.error({type:'POST Error', error: error});
        self.logger("POST Error: " + error);
      });
    });

    _promise.catch(function(errorObj){
      let error = (Object.keys(errorObj).length > 0) ? errorObj : {error: errorObj.toString()};
      self.error(errorObj);
      self.logger('POST Promise Rejected. ' + JSON.stringify(error));
    });

    return _promise;
  }

  /**
   *
   * @param url
   * @param opts
   * @returns {Promise}
   * @private
   */
  put(headers, url, opts) {
    let self = this;
    let _promise = new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(opts),
        cache: "no-cache",
        headers: headers
      })
      .then(function(response) {
        const contentType = response.headers.get("content-type");
        const shouldResolve = self.responseHandler(response.status);
        if(shouldResolve){
          resolve(self.readResponseBody(contentType, response));
          return;
        }else{
          let aux = response.clone();
          reject({type:'GET Error', code:response.status, url:url, aux: aux});
          return;
        }
      })
      .catch(function(error) {
        self.error({type:'PUT Error', error: error});
        self.logger("PUT Error: " + error);
      });
    });

    _promise.catch(function(errorObj){
      let error = (Object.keys(errorObj).length > 0) ? errorObj : {error: errorObj.toString()};
      self.error(errorObj);
      self.logger('PUT Promise Rejected. ' + JSON.stringify(error));
    });
    return _promise;
  }

  /**
   *
   * @param headers
   * @param url
   * @param opts
   * @returns {Promise}
   */
  delete(headers, url, opts) {
    let self = this;
    let _promise = new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE",
        body: JSON.stringify(opts),
        cache: "no-cache",
        headers: headers
      })
      .then(function(response) {
        const contentType = response.headers.get("content-type");
        const shouldResolve = self.responseHandler(response.status);
        if(shouldResolve){
          resolve(self.readResponseBody(contentType, response));
          return;
        }else{
          let aux = response.clone();
          reject({type:'GET Error', code:response.status, url:url, aux: aux});
          return;
        }
      })
      .catch(function(error) {
        self.error({type:'DELETE Error', error: error});
        self.logger("DELETE Error: " + error);
      });
    });

    _promise.catch(function(errorObj){
      let error = (Object.keys(errorObj).length > 0) ? errorObj : {error: errorObj.toString()};
      self.error(errorObj);
      self.logger('DELETE Promise Rejected. ' + JSON.stringify(error));
    });
    return _promise;
  }
}

export { Model }