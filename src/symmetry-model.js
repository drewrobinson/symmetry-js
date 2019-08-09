import { logger } from "./symmetry-utils";

/**
 *
 * Represents Service Model
 *
 * @author Drew Robinson <drobinso@adobe.com>
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
   * Responsible for publishing error message on service bus
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
  getResponseBody(contentType, response){

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

          //Error
          if(response.status >= 400){
            let aux = response.clone();
            reject({type:'GET Error', code:response.status, url:url, aux: aux});
            return;
          }

          //Redirect
          if (response.status >= 300) {
            resolve(self.getResponseBody(contentType, response));
            return;
          }

          //Success
          if (response.status > 200) {
            resolve(self.getResponseBody(contentType, response));
            return;
          }

          if(response.status === 200) {
            resolve(self.getResponseBody(contentType, response));
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

          //Error
          if(response.status >= 400){
            let aux = response.clone();
            reject({type:'POST Error', code:response.status, url:url, aux: aux});
            return;
          }

          //Redirect
          if (response.status >= 300) {
            resolve(self.getResponseBody(contentType, response));
            return;
          }

          //Success
          if (response.status > 200) {
            resolve(self.getResponseBody(contentType, response));
            return;
          }

          if(response.status === 200) {
            resolve(self.getResponseBody(contentType, response));
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

          //Error
          if(response.status >= 400){
            let aux = response.clone();
            reject({type:'PUT Error', code:response.status, url:url, aux: aux});
            return;
          }

          //Redirect
          if (response.status >= 300) {
            resolve(self.getResponseBody(contentType, response));
            return;
          }

          //Success
          if (response.status > 200) {
            resolve(self.getResponseBody(contentType, response));
            return;
          }

          if(response.status === 200) {
            resolve(self.getResponseBody(contentType, response));
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
    })

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

          //Error
          if(response.status >= 400){
            let aux = response.clone();
            reject({type:'DELETE Error', code:response.status, url:url, aux: aux});
            return;
          }

          //Redirect
          if (response.status >= 300) {
            resolve(self.getResponseBody(contentType, response));
            return;
          }

          //Success
          if (response.status > 200) {
            resolve(self.getResponseBody(contentType, response));
            return;
          }

          if(response.status === 200) {
            resolve(self.getResponseBody(contentType, response));
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
    })

    return _promise;
  }

  /**
   *
   * getData
   *
   */
  getData() {
    return this.data;
  }

  /**
   *
   * setData
   *
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
}

export { Model }