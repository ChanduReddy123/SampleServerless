'use strict';
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
let docClient = new AWS.DynamoDB.DocumentClient();

module.exports.create = async event => {
    if (event.queryStringParameters != null) {
        var params = {
            TableName: process.env.TableName,
            Item: {
                Name: event.queryStringParameters.name,
                Age: event.queryStringParameters.age
            }
        };
        var result;
        try {
            result = await docClient.put(params).promise()
        }
        catch (putError) {
            console.log('There is a problem inserting the data');
            console.log('Parameters', params);
        }
        return {
            statusCode: 200,
            body: JSON.stringify('Item created successfully', result)
        }
    }
    else {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Give the name as query parameter'
            })
        }
    }
};
module.exports.list = async event => {
    console.log(event.queryStringParameters);
    // if(!(typeof event.queryStringParameters.name === null) )
    try {
        var params = {
            TableName: process.env.TableName,
            Key: {
                Name: event.queryStringParameters.name
            }
        }
        var data = await docClient.get(params).promise()
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    user: data
                }
            )
        }
    }
    catch (typeError) {
        try {
            var params = {
                TableName: process.env.TableName
            }
            var data = await docClient.scan(params).promise()
            return {
                statusCode: 200,
                body: JSON.stringify(
                    {
                        users: data.Items
                    }
                )
            }
        }
        catch (scanError) {
            console.log(scanError);
            return {
                statusCode: 400,
                body: JSON.stringify(scanError)
            }
        }
        
    }


};
module.exports.update = async event => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'this is in update function! '+event.queryStringParameters.name,
            },
            null,
            2
        ),
    };
};
module.exports.delete = async event => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Function updated by rakesh'
            },
            null,
            2
        ),
    };
};