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
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'PlayPodcastIntent';
  },
  handle(handlerInput) {
    return controller.play(handlerInput);
  }
};

const controller = {
  async play(handlerInput) {
    console.log('player controller');
    const { attributesManager, responseBuilder } = handlerInput;

    responseBuilder.speak('再生します');

    return responseBuilder.getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
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
  .addRequestHandlers(LaunchHandler, SessionEndedRequestHandler, StartPlaybackHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
