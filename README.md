# Kathy Here Backend

An AI powered dating chatbot backend powered by [Google Gemini](https://ai.google.dev/)

Created using Express JS

Hosted on : https://kathyhere.cyclic.app

Frontend repository : https://github.com/akhiljw46/kathyhere-frontend

## How to run

### Step 1

Create a `config.env` file in the project folder with the following variables :

`API_KEY` : Google Gemini API key. You can get it [here](https://makersuite.google.com/app/apikey).

`PORT` : The port to run the server. Default port is 3000.

`ENVIRONMENT` : Either `development` or `production`.

`LOG_URL` : The database to save the logs in case of development.

### Step 2

Run the following commands:

```
npm install
npm start
```

## API documentation

Send `POST` request to `{API_URL}/v1/message/{USER_MODEL}`

Where `{API_URL}` is the url of the server and `{USER_MODEL}` is the model to be used, either `kathy` or `tom`.

With payload in the forllowing format:

```
{
    "messages": [
        {
            "id": 1703609459098,
            "isUser": false,
            "messageText": "Message by AI"
        },
        {
            "id": 1703609459099,
            "isUser": true,
            "messageText": "Message by User"
        }
    ]
}
```

Where the `messages` array contains objects with the following properties:

`id` is the unique message id.

`isUser` is a boolean `true` if the message is by the user and `false` if the message is by the AI model.

`messageText` is the message content.

Response will be in the following format:

```
{
    "status": "success",
    "message": "Reply message"
}
```

Where, `status` is either `success` or `failed`

and `message` is the reply message in case of `success` or error message in case of `failed` statuses.
