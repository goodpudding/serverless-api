const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const { handler } = require('../createCats');

// Replace '../path/to/your/lambda/function' with the actual path to your Lambda function file

describe('Create Cat Handler', () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore();
  });

  test('should create a cat successfully', async () => {
    const event = {
      body: JSON.stringify({
        id: 1,
        name: 'Taco',
        age: 3,
        breed: 'Burmese',
        sex: 'Female',
        fixed: true,
        note: 'Happy',
      }),
    };

    // Mock the DynamoDB put operation
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, { Attributes: JSON.parse(event.body) });
    });

    const response = await handler(event);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(event.body);
  });

  test('should return a 500 error on failure', async () => {
    const event = {
      body: JSON.stringify({
        id: 2,
        name: 'Error',
        age: 4,
        breed: 'Error Breed',
        sex: 'Male',
        fixed: false,
        note: 'Error',
      }),
    };

    // Mock the DynamoDB put operation to throw an error
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(new Error('Internal Server Error'));
    });

    const response = await handler(event);
    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Internal Server Error');
  });
});
