const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const faker = require('faker')

AWS.config.update({region:'us-east-1'});

const sns = new AWS.SNS();

const topic = 'arn:aws:sns:us-east-1:979886040326:pickup';

setInterval(() => {
  const message = {
    orderId: uuid(),
    customer: faker.name.findName(),
    vendorId: 'arn:aws:sqs:us-east-1:979886040326:vendor'
  }

  const payload = {
    Message: JSON.stringify(message),
    TopicArn: topic,
  };

  sns.publish(payload).promise()
    .then(data => {
      console.log('Order sent to driver ------> \n', data);
      console.log('--------------Order sent to driver -----------------');
    })
    .catch(console.error);
}, 5000);

///////////////////////////////////////////////

// receive delivery acknowledgement
const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/979886040326/vendor',
  handleMessage: handler,
});

function handler(message) {
    console.log('---------------Handler---------------');
  console.log(message.Body);
  console.log('------------------------------');
}

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();