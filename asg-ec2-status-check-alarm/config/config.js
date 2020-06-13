// @ts-check
/** @enum {string} */
const EC2_ACTIONS = {
  REBOOT: 'reboot',
  RECOVER: 'recover',
  STOP: 'stop',
  TERMINATE: 'terminate'
}

const alarmDefault = {
  // Add the configs needed for your environments.
  snsTopicArn: ''
}

class Config {
  /**
   * @param {Object} param
   * @param {Object} param.alarm
   * @param {String} param.alarm.snsTopicArn
   * @param {String} param.region
   * @param {String} param.lambdaRoleArn
   * @param {String} param.deploymentBucket
   * @param {Object<string, EC2_ACTIONS>} param.asgActions
   */
  constructor (param) {
    this.alarm = { ...alarmDefault, ...param.alarm }
    this.region = param.region
    this.lambdaRoleArn = param.lambdaRoleArn
    this.deploymentBucket = param.deploymentBucket
    this.asgActions = param.asgActions
  }

  getRegion () {
    return this.region
  }

  getDeploymentBucket () {
    return this.deploymentBucket
  }

  getSnsTpoicArn () {
    return this.alarm.snsTopicArn
  }

  getLambdaRoleArn () {
    return this.lambdaRoleArn
  }

  getAsgList () {
    return Object.keys(this.asgActions)
  }

  getEc2Action (asgName) {
    return this.asgActions[asgName] || EC2_ACTIONS.RECOVER
  }
}

Config.EC2_ACTIONS = EC2_ACTIONS

module.exports = Config
