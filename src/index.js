'use strict';

const async = require('async');
const request = require('request');
const tinyGradient = require('tinygradient');

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
const tempMax = 77;
const tempRange = tempMax - tempMin;

// Target colors
const colorCold = "#0000FF";
const colorHot = "#FF0000";
const colorRange = 100;

// Off color. Full black turns off the strip.
const ledOffColor = "000000";

// Threshold for keeping strip 'on'. Define what percentage of the lux range will keep the strip turned on.
const luxThreshold = 0.5;

const urls = [
    `https://us.wio.seeed.io/v1/node/GroveDigitalLightI2C0/lux?access_token=${accessToken}`,
    `https://us.wio.seeed.io/v1/node/GroveTempHumD2/temperature_f?access_token=${accessToken}`
];

exports.handler = (event, context, callback) => {
    async.map(urls, httpGet, function (err, res) {

        // Abort on error
        if (err) {
            console.log(`Get request error ${err}`);
            callback(err, res);
            return;
        }

        // Merge all GET JSON responses
        const merged = {
            lux: luxMax,
            fahrenheit_degree: tempMax
        };
        res.forEach((item) => Object.assign(merged, item));

        // Get the lux or set an impossibly high value on error, sensor returns error in event of too bright of light
        const lux = isNaN(merged.lux) ? luxMax : clamp(merged.lux, luxMin, luxMax);

        // Get the temperature or set to 'hot'
        const tempF = isNaN(merged.fahrenheit_degree) ? tempMax : clamp(merged.fahrenheit_degree, tempMin, tempMax);

        // Using the defined range and reported lux, determine a relative brightness reported by the sensor as a value
        // between 0 and 1 with 0 indicating a dark room and 1 indicating the most lit value of the room.
        const brightness = 1 - ((luxRange - clamp(lux, luxMin, luxMax) - luxMin) / luxRange);

        // Turn off the strip if the room is too bright
        let temperatureColor = ledOffColor;
        if (brightness <= luxThreshold) {
            // Create the color gradient
            //noinspection JSUnresolvedFunction
            const gradientHsv = tinyGradient([colorCold, colorHot])
                .hsv(colorRange, true);

            // Get the current color
            const tempRatio = (tempMax - tempF) / tempRange;
            const temperature = Math.floor((1.0 - tempRatio) * colorRange) - 1;
            //noinspection JSUnresolvedFunction
            temperatureColor = gradientHsv[temperature]
                .darken(Math.floor(brightness * 100 * luxThreshold))
                .toHex();
        }

        setLights(ledCount, temperatureColor, accessToken);
    });

    function setLights(ledCount, temperatureColor, accessToken) {
        const url = `https://us.wio.seeed.io/v1/node/GroveLedWs2812D0/clear/${ledCount}/${temperatureColor}?access_token=${accessToken}`;

        httpPost(url, function (err, res) {
            callback(err, res);
        });
    }
};

function httpPost(url, callback) {
    const options = {
        method: 'POST',
        url: url,
        json: true
    };

    request(options, function (err, res, body) {
        callback(err, body);
    });
}

function httpGet(url, callback) {
    const options = {
        url: url,
        json: true
    };

    request(options, function (err, res, body) {
        callback(err, body);
    });
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
