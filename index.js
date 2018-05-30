const Alexa = require('ask-sdk-core');
const constants = require('./constants');

// スキルを起動したときの処理
const LaunchHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('おすすめポッドキャストを再生します')
      .reprompt('おすすめポッドキャストを再生します')
      .getResponse();
  }
};

// ユーザーがヘルプを求めたときの処理
const HelpHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  async handle(handlerInput) {
    const message =
      'TechPodへようこそ。「ポッドキャストを再生して」と言うと、最新のポッドキャストを再生します';

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(message)
      .getResponse();
  }
};

const controller = {
  async play(handlerInput) {
    const { attributesManager, responseBuilder } = handlerInput;
    const playBehavior = 'REPLACE_ALL';
    const podcast = constants.audioData[0];
    const token = 0;
    const offsetInMilliseconds = 0;

    responseBuilder
      .speak('再生します')
      .withShouldEndSession(true)
      .addAudioPlayerPlayDirective(playBehavior, podcast.url, token, offsetInMilliseconds, null);

    return responseBuilder.getResponse();
  }
};

// セッションが中断されたときの処理
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  }
};

// どのハンドラーでも扱えなかったときの処理
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

// 音声再生に関するリクエストを処理
const StartPlaybackHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'PlayPodcastIntent';
  },
  handle(handlerInput) {
    return controller.play(handlerInput);
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(LaunchHandler, HelpHandler, SessionEndedRequestHandler, StartPlaybackHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
