const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;
const constants = require('./constants');

function parseXml(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, {}, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
}

async function getEpisode(feedUrl) {
  const response = await fetch(feedUrl);
  const body = await response.text();
  const result = await parseXml(body);
  const item = result.rss.channel[0].item[0]; //最新話のデータ
  const episode = {
    title: item.title[0],
    url: item.enclosure[0].$.url
  };

  return episode;
}

exports.getEpisode = getEpisode;
