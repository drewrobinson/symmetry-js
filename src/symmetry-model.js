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
  error(url){
    let self = this;
    self.service.bus.publish(self.MODEL_ERROR, url);
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
          reject(`GET Error. Code ${response.status}. Request ${url}`);
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
      .catch(function(reason) {
        self.error(`GET Error: Unable to Get ${url}`);
        throw new Error("GET Error: " + reason)
      });
        
    });
    
    _promise.catch(function(error){
      self.error(`GET Promise Error: Unable to get ${url}`);
      self.logger('GET Promise Rejected. ',error);
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
            reject(`{POST Error. Code ${response.status}. Request ${url}`);
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
        .catch(function(reason) {
          self.error(`Post Error: Unable to post ${url}`);
          throw new Error("POST Error: " + reason)
        });
    });
    
    _promise.catch(function(error){
      self.error(`Post Promise Error: Unable to post ${url}`);
      self.logger('POST Promise Rejected. ',error);
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
            reject(`PUT Error. Code ${response.status}. Request ${url}`);
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
        .catch(function(reason) {
          self.error(`Put Error: Unable to put ${url}`);
          throw new Error("PUT Error: " + reason)
        });
    });
    
    _promise.catch(function(error){
      self.error(`PUT Promise Error: Unable to put ${url}`);
      self.logger('PUT Promise Rejected. ',error);
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
            reject(`DELETE Error. Code ${response.status}. Request ${url}`);
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
        .catch(function(reason) {
          self.error(`Delete Error: Unable to delete ${url}`);
          throw new Error("DELETE Error: " + reason)
        });
    });
    
    _promise.catch(function(error){
      self.error(`DELETE Promise Error: Unable to delete ${url}`);
      self.logger('DELETE Promise Rejected. ',error);
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