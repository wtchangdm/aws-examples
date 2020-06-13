# What's this?

This is a sample for a combination of CloudWatch Events and Lambda to:

- Automatically create status check alarm when a instance of certain auto scaling groups is created.
  - This alarm will automatically recover the instances that failing the status check.
- Automatically delete alarm when these instances is terminated.

# Link

http://blog.wtcx.dev/2020/06/14/automatically-recover-ec2-instances-with-cloudwatch-events-and-lambda/
