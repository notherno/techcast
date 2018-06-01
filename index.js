const Alexa = require('ask-sdk-core');
const constants = require('./constants');

// スキルを起動したときの処理
const LaunchHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return controller.play(handlerInput);
  }
};

// ユーザーがヘルプを求めたときの処理
const HelpHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const message =
      'TechPodへようこそ。「テックキャストを開いて」と言うと最新のポッドキャストを再生できます';

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(message)
      .getResponse();
  }
};

const controller = {
  play(handlerInput) {
    const { responseBuilder } = handlerInput;
    const message = '最新のポッドキャストを再生します';
    const playBehavior = 'REPLACE_ALL';
    const podcast = constants.audioData[0];
    const token = 0;
    const offsetInMilliseconds = 0;

    responseBuilder
      .speak(message)
      .withShouldEndSession(true)
      .addAudioPlayerPlayDirective(playBehavior, podcast.url, token, offsetInMilliseconds, null);

    return responseBuilder.getResponse();
  },
  stop(handlerInput) {
    return handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse();
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

const PausePlaybackHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.StopIntent' ||
        request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.PauseIntent')
    );
  },
  handle(handlerInput) {
    return controller.stop(handlerInput);
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(LaunchHandler, HelpHandler, SessionEndedRequestHandler, PausePlaybackHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
