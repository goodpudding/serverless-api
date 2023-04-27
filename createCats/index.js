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

exports.handler = async (event) => {
  console.log('CREATE CAT EVENT OBJECT', event);

  const catData = JSON.parse(event.body);
  const cat = new CatModel(catData);

  try {
    const newCat = await cat.save();
    console.log('CREATED CAT', newCat);
    return {
      statusCode: 201,
      body: JSON.stringify(newCat),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
