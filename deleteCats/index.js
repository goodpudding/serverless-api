const dynamoose = require('dynamoose');

const catSchema = new dynamoose.Schema({
  id: Number, 
  name: String,
  age: Number,
  breed: String,
  sex: String,
  fixed: Boolean,
  note: String
});

const CatModel = dynamoose.model('cats', catSchema);

exports.handler = async(event) => {
  console.log('DELETING CATS EVENT OBJECT', event);

  let parameters = event.pathParameters;
  let responseBody = null;
  let response = null;

  if (parameters) {
    let cat = await CatModel.delete(parameters.id);
    console.log('DELETED CAT FROM OUR TABLE', cat);
    response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Cat deleted successfully' }),
    };
  } else {
    response = {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' }),
    };
  }
  return response;
};
