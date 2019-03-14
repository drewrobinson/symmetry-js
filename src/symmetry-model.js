/**
 * 
 * Model
 * 
 * @author Drew Robinson <drobinso@adobe.com>
 * 
 */

class Model {

  constructor(service, msg) {
    this.service = service;
    this.data = {};
    this.MODEL_UPDATED = msg;
    this.service.serviceBus.messages[msg] = msg;
  }

  /**
   *
   * @param url
   * @returns {Promise}
   * @private
   */
  get(headers, url) {
    
    return new Promise(resolve => {
      fetch(url, {
          method: "GET",
          cache: "no-cache",
          headers: headers,
          credentials: "same-origin"
        })
        .then(function(response) {
          if (response.status === 204) {
            resolve([]);
          } else {
            resolve(response.json());
          }
        })
        .catch(function(reason) {
          throw new Error("Network Error: " + reason)
        });
    })
  }

  /**
   *
   * @param url
   * @param opts
   * @returns {Promise}
   * @private
   */
  post(headers, url, opts) {

    return new Promise(resolve => {
      fetch(url, {
          method: "POST",
          body: JSON.stringify(opts),
          cache: "no-cache",
          headers: headers
        })
        .then(function(response) {
          if (response.status === 204) {
            resolve(true);
          } else if (response.status === 307) {

          } else {
            resolve(response.text());
          }
        })
        .catch(function(reason) {
          throw new Error("Network Error: " + reason)
        });
    })
  }

  /**
   *
   * @param url
   * @param opts
   * @returns {Promise}
   * @private
   */
  put(headers, url, opts) {

    return new Promise(resolve => {
      fetch(url, {
          method: "PUT",
          body: JSON.stringify(opts),
          cache: "no-cache",
          headers: headers
        })
        .then(function(response) {
          if (response.status === 204) {
            resolve(true);
          } else {
            resolve(response.json());
          }
        })
        .catch(function(reason) {
          throw new Error("Network Error: " + reason)
        });
    })
  }

  /**
   *
   * @param headers
   * @param url
   * @param opts
   * @returns {Promise}
   */
  delete(headers, url, opts) {
    return new Promise(resolve => {
      fetch(url, {
          method: "DELETE",
          body: JSON.stringify(opts),
          cache: "no-cache",
          headers: headers
        })
        .then(function(response) {
          if (response.status === 204) {
            resolve(true);
          }
          if (response.status === 403) {
            resolve(false);
          }
        })
        .catch(function(reason) {
          throw new Error("Network Error: " + reason)
        });
    })
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
    if (!data) {
      throw new Error("Cannot set catalog data");
    }

    let aux = Object.assign({}, data);
    this.data = null;
    this.data = Object.freeze(aux);

    this.service.serviceBus.publish(this.MODEL_UPDATED, this.data);
  }
}

export { Model }