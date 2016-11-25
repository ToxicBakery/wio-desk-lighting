# Wio Link Starter Kit & AWS Lambda for Desk Lighting
Use the [Wio Link Starter Kit](https://www.seeedstudio.com/Wio-Link-Starter-Kit-p-2614.html), [AWS Lambda](https://aws.amazon.com/lambda/), and [Node](https://nodejs.org/en/)  to create environment based lighting.

## Requirements
You must have the following prerequisites installed and configured.
 * Node 4.2.+
 * [IAM User](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) with Lambda permissions configured
 * [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html) configured to login with Lambda privileged user

## Setup
todo

## Deployment
To deploy to AWS, simply run `./publish.sh` to zip and push the project.

## Configuration
By default the project is setup to use the light and temperature sensors to determine a color to display on the LED strip. The light sensor is used to determine the brightness of the strip while the temperature sensor is used to manipulate how blue or red the strip is. Red indicates the temperature sensor is reading hot while blue is cool. This functionality can be modified in constants of the [index.js](src/index.js) script.

