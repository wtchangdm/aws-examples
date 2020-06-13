const Config = require('./config')

const qa = new Config({
  alarm: {
    snsTopicArn: '<RANDOM_SNS_TOPIC_ARN>'
  },
  deploymentBucket: '<BUCKET_TO_STORE_LAMBDA_ARTIFACT>',
  lambdaRoleArn: '<LAMBDA_ROLE_ARN>',
  region: 'ap-northeast-1',
  asgActions: {
    'SOME-QA-ASG': Config.EC2_ACTIONS.RECOVER,
    'ANOTHER-QA-ASG': Config.EC2_ACTIONS.RECOVER,
    'YET-ANOTHER-QA-ASG': Config.EC2_ACTIONS.RECOVER
  }
})

module.exports = qa
