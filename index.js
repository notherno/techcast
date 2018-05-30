const Alexa = require('ask-sdk-core');

const LaunchHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('おすすめポッドキャストを再生します')
      .reprompt('おすすめポッドキャストを再生します')
      .getResponse();
  }
};

const StartPlaybackHandler = {
  canHandle(handleInput) {
    const { request } = handleInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'PlayPodcastIntent';
  },
  handle(handleInput) {
    return controller.play(handleInput);
  }
};

const controller = {
  async play(handleInput) {
    console.log('player controller');
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const { request } = handlerInput.requestEnvelope;

    console.log(`Error occured: ${error}`);
    console.log(`Original request was ${JSON.stringify(request, null, 2)}\n`);

    return handlerInput.responseBuilder
      .speak('すみません。よくわかりません。もう一度お願いします。')
      .reprompt('すみません。よくわかりません。もう一度お願いします。')
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(LaunchHandler, StartPlaybackHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
