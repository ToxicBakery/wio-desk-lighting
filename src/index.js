'use strict';

const async = require('async');
const request = require('request');
const tinygradient = require('tinygradient');

// Wio Link Access token
const accessToken = process.env.ACCESS_TOKEN;

// LED strip size
const ledCount = 30;

// Lux value range
const luxMax = 300;
const luxMin = 0;
const luxRange = luxMax - luxMin;

// Temp value range
const tempMin = 74;
const tempMax = 80;
const tempRange = tempMax - tempMin;

// Target colors
const colorCold = "#0000FF";
const colorHot = "#FF0000";
const colorRange = 100;

const urls = [
  `https://us.wio.seeed.io/v1/node/GroveDigitalLightI2C0/lux?access_token=${accessToken}`,
  `https://us.wio.seeed.io/v1/node/GroveTempHumD2/temperature_f?access_token=${accessToken}`
  ];

exports.handler = (event, context, callback) => {
  async.map(urls, httpGet, function (err, res) {
    // Merge all GET JSON responses
    var merged = {};
    res.forEach((item) => Object.assign(merged, item));

    // Get the lux or set an impossibly high value on error, sensor returns error in event of too bright of light
    var lux = isNaN(merged.lux) 
          ? luxMax : clamp(merged.lux, luxMin, luxMax);

    // Get the temperature or set to 'hot'
    var tempF = isNaN(merged.fahrenheit_degree) 
          ? tempMax : clamp(merged.fahrenheit_degree, tempMin, tempMax);

    // Using the defined range and reported lux, determine a relative brightness reported by the sensor as a value
    // between 0 and 1 with 0 indicating a dark room and 1 indicating the most lit value of the room.
    var shiftedLux = clamp(lux, luxMin, luxMax) - luxMin;
    var brightness = (luxRange - shiftedLux) / luxRange;
    
    // Create the color gradient
    var gradientHsv = tinygradient([
          colorCold,
          colorHot
      ])
      .hsv(colorRange, true);

    // Get the current color
    var tempDiff = tempMax - tempF;
    var tempRatio = tempDiff / tempRange;
    var temperature = Math.floor((1.0 - tempRatio) * colorRange);
    var temperatureTinyColor = gradientHsv[temperature - 1];
    var temperatureColor = temperatureTinyColor
          .darken(Math.floor(brightness * -20))
          .toHex();
   
    var url = `https://us.wio.seeed.io/v1/node/GroveLedWs2812D0/clear/${ledCount}/${temperatureColor}?access_token=${accessToken}`;

    httpPost(url, function(err, res){
        callback(err, res);
      });
  });
};

function httpPost(url, callback) {
  const options = {
    method: 'POST',
    url: url,
    json: true
  };

  request(options, function(err, res, body) {
      callback(err, body);
    });
}

function httpGet(url, callback) {
  const options = {
    url:  url,
    json: true
  };

  request(options, function(err, res, body) {
      callback(err, body);
    });
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}


