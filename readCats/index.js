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
  console.log('READING CATS EVENT OBJECT', event);

  let parameters = event.pathParameters;
  let responseBody = null;
  let response = null;

  if (parameters) {
    let cats = await CatModel.query('id').eq(parseInt(parameters.id)).exec();
    console.log('CAT FROM OUR TABLE', cats);
    response = {
      statusCode: 200,
      body: JSON.stringify(cats),
    };
  } else {
    response = await CatModel.scan().exec();
    console.log('CATS FROM OUR TABLE', response);
    response = {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  }
  return response;
};
