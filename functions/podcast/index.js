const Alexa = require('ask-sdk-core');
const constants = require('./constants');
const { getEpisode } = require('./feed');

// スキルを起動したときの処理
const LaunchHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const message =
      'テックキャストは技術系ポッドキャストを再生できるスキルです。ポッドキャストを再生しますか？';

    return handlerInput.responseBuilder
      .speak(message)
      .reprompt(message)
      .getResponse();
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

const PlayPodcastIntent = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'PlayPodcastIntent';
  },
  handle(handlerInput) {
    return controller.randomPlay(handlerInput);
  }
};

const controller = {
  async randomPlay(handlerInput) {
    const { responseBuilder } = handlerInput;
    const playBehavior = 'REPLACE_ALL';
    const index = Math.floor(Math.random() * constants.audioData.length);
    const podcast = await getEpisode();
    const message = `${podcast.title}を再生します`;
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
  .addRequestHandlers(
    LaunchHandler,
    HelpHandler,
    PlayPodcastIntent,
    SessionEndedRequestHandler,
    PausePlaybackHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
