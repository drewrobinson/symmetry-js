import { logger } from "./symmetry-utils";

class PubSub {

    constructor(id) {
        this.id = id;
        this.messages = {};
        this.listeners = {};
        this.logger = logger;
    }

    /**
     * Responsible for registering message with message bus
     */
    registerMessage(msg) {

        let self = this;

        if (typeof msg !== "string") {
            throw new TypeError(`Register Message Error: Message argument should be of type string`);
        }

        if (!self.messages.hasOwnProperty(msg) && !self.listeners.hasOwnProperty(msg)) {
            self.messages[msg] = msg;
            self.listeners[msg] = [];
        } else {
            self.logger(`Register Message Notification: ${msg} has already been registered with ${self.id}`);
        }
    }

    /**
     * Responsible for unregistering message with message bus
     */
    unregisterMessage(msg) {
        let self = this;

        if (typeof msg !== "string") {
            throw new TypeError(`Unregister Message Error: Message argument should be of type string`);
        }

        delete self.messages[msg];
        delete self.listeners[msg];
    }

    /**
     * Responsible for subscribing listener to message.
     * @param {String} msg - Required
     * @param {fn} listener - Required
     * @param {object} context - Required if listener is not bound
     */
    subscribe(msg, listener, context) {

        let self = this;


        if (!self.messages.hasOwnProperty(msg) || !Object.keys(self.listeners).includes(msg)) {
            throw new ReferenceError(`Subscribe Error: Attempting to subscribe to message: ${msg} before it was registered with ${self.id} `);
        }


        if (typeof listener !== "function") {
            throw new TypeError(`Subscribe Error: listener argument should be of type function`);
        }


        if (listener.name.length < 1 || typeof listener.name === 'undefined') {
            throw new ReferenceError(`Subscribe Error: listener must be named function`);
        }

        if (typeof context !== 'object') {
            throw new TypeError(`Subscribe Error: ${listener.name} listener is missing context`);
        }

        self.listeners[msg].push({
            listener: listener,
            context: context
        });
    }


    /**
     * Responsible for removing listener
     * @param {String} msg
     * @param {fn} callBack
     * @param {} context - Required if callback is not bound
     */
    unsubscribe(msg, listener, context) {
        let self = this;

        if (!self.messages.hasOwnProperty(msg) || !Object.keys(self.listeners).includes(msg)) {
            throw new ReferenceError(`Unsubscribe Error: Attempting to unsubscribe from message: ${msg} before it was registered with ${self.id} `);
        }

        if (typeof listener !== "function") {
            throw new TypeError(`Subscribe Error: listener argument should be of type function`);
        }

        if (listener.name.length < 1 || typeof listener.name === 'undefined') {
            throw new ReferenceError(`Subscribe Error: listener must be named function`);
        }

        if (typeof context !== 'object') {
            throw new TypeError(`Subscribe Error: ${listener.name} listener is missing context`);
        }

        let i = 0,
          l = self.listeners[msg].length;

        for (i; i < l; i++) {
            if (self.listeners[msg][i].listener.name === listener.name && self.listeners[msg][i].context === context) {
                self.listeners[msg].splice(i, 1);
                break;
            }
        }
    }

    /**
     * Responsible for publishing message data to listeners
     * @param {String} msg
     * @param {object} data
     */
    publish(msg, data) {

        let self = this;

        if (!self.messages.hasOwnProperty(msg) || !Object.keys(self.listeners).includes(msg)) {
            throw new ReferenceError(`Publish Error: Attempting to publish message: ${msg} before it was registered with ${self.id} `);
        }

        if (typeof data === 'undefined') {
            throw new TypeError(`Publish Error: Attempting to publish message: ${msg} without value on ${self.id}`);
        }

        if (!self.listeners[msg]) {
            self.logger(`Publish Notification: No ${self.id} listeners have subscribed to ${msg} at this point in execution.`);
            return;
        }

        let i = self.listeners[msg].length;

        while (i--) {

            self.listeners[msg][i].listener.call(self.listeners[msg][i].context, {
                msg: msg,
                data: data
            });
        }

    }

} //-->

export {
  PubSub
}