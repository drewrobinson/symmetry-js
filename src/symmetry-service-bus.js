class ServiceBus {

  constructor() {
    // Project specific
    this.messages = {
        SM_TOPNEWSLIST_MODEL_UPDATED : "SM_TOPNEWSLIST_MODEL_UPDATED",
        SM_PROFILE_MODEL_UPDATED : "SM_PROFILE_MODEL_UPDATED"
    };
  }
}

let serviceBus = new ServiceBus();

export { serviceBus };