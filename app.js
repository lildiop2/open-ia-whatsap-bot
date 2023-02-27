
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

venom
  .create({
    session: 'session-name', //name of session
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    // console.log('message :>> ', message);
    if(message.body.startsWith("#") && message.isGroupMsg === false) {
      runCompletion(message.body.substring(1))
      .then(async (result) => {
        console.log('OpenIA Result: ', result);
        client
        .reply(message.from, result, message.id)
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro); //return object error
      });
    }
  });
}

async function runCompletion (message) {
  const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 200,
  });
  return completion.data.choices[0].text;
}

