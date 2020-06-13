const AWS = require('aws-sdk')
const cloudWatch = new AWS.CloudWatch()
const { ENV } = process.env

const config = require(`./config/${ENV}`)
const getEC2Action = event => {
  const region = event.region
  const asgName = event.detail.AutoScalingGroupName
  const action = config.getEc2Action(asgName)
  return `arn:aws:automate:${region}:ec2:${action}`
}

const getAlarmName = instanceId => {
  // Create the alarm name you like.
  return `${instanceId}-status-check-system-failure-alarm`
}

const createAlarm = async event => {
  const { EC2InstanceId: instanceId } = event.detail
  const params = {
    AlarmName: getAlarmName(instanceId),
    ComparisonOperator: 'GreaterThanThreshold',
    EvaluationPeriods: 1,
    ActionsEnabled: true,
    AlarmActions: [
      config.getSnsTpoicArn(),
      getEC2Action(event)
    ],
    AlarmDescription: `${instanceId}'s alarm based on StatusCheckFailed_System, and will try to recover when metric > 0`,
    DatapointsToAlarm: 1,
    Dimensions: [
      {
        Name: 'InstanceId',
        Value: instanceId
      }
    ],
    MetricName: 'StatusCheckFailed_System',
    Namespace: 'AWS/EC2',
    OKActions: [
      // Add actions here if necessary.
    ],
    Period: 60,
    Statistic: 'Minimum',
    Threshold: 0,
    Unit: 'Count'
  }

  try {
    await cloudWatch.putMetricAlarm(params).promise()
    console.log(`Created alarm: "${getAlarmName(instanceId)}"`)
  } catch (error) {
    console.log(`Failed to create alarm "${getAlarmName(instanceId)}: ${error.message}"`)
  }
}

const deleteAlarm = async event => {
  const { EC2InstanceId: instanceId } = event.detail
  const alarmName = getAlarmName(instanceId)
  try {
    const params = { AlarmNames: [alarmName] }
    await cloudWatch.deleteAlarms(params).promise()
    console.log(`Deleted alarm: "${alarmName}"`)
  } catch (error) {
    console.log(`Failed to delete alarm "${alarmName}: ${error.message}"`)
  }
}

/**
 * For sample payload of 'event' object, see samplePayload.json
 */
const handler = async event => {
  const shoudCreateAlarm = event['detail-type'].includes('Launch')
  const act = shoudCreateAlarm ? createAlarm : deleteAlarm

  return act(event)
}

module.exports.handler = handler
