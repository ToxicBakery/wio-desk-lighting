# Wio Link Starter Kit & AWS Lambda for Desk Lighting
Use the [Wio Link Starter Kit](https://www.seeedstudio.com/Wio-Link-Starter-Kit-p-2614.html), [AWS Lambda](https://aws.amazon.com/lambda/), and [Node](https://nodejs.org/en/)  to create environment based lighting.

## Requirements
You must have the following prerequisites installed and configured.
 * Node 4.2.+
 * [IAM User](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) with Lambda permissions configured
 * [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html) configured to login with Lambda privileged user

## Setup
Prepare the project with by running `npm install` in the root directory.

Once complete, edit [GulpFile.js](GulpFile.js) with your Wio Link access token. You can find the access token via the iOS and Android application associated to your Wio Link by navigating to the API view in the application.

## Deployment
To deploy to AWS, simply run gulp. The `src` directory will be copied to `dest`, npm install will be run, and the project will be zipped and pushed to Lambda.

## Configuration
By default the project is setup to use the light and temperature sensors to determine a color to display on the LED strip. The light sensor is used to determine the brightness of the strip while the temperature sensor is used to manipulate how blue or red the strip is. Red indicates the temperature sensor is reading hot while blue is cool. This functionality can be modified in constants of the [index.js](src/index.js) script.

## Sample
Cool temperature reading  
![cold](https://cloud.githubusercontent.com/assets/1614281/20637029/d15b3704-b347-11e6-9c61-73200f78238c.jpg)

Medium temperature reading  
![mid](https://cloud.githubusercontent.com/assets/1614281/20637031/d16bb4b2-b347-11e6-88fa-58dd10f8017e.jpg)

Hot temperature reading  
![hot](https://cloud.githubusercontent.com/assets/1614281/20637030/d16571a6-b347-11e6-93ce-5ffd6ce78786.jpg)
