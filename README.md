# Getting started

* Clone the repo and install npm packages
    
        git clone git@github.com:mirrorthatlook/mtl-bot-example.git
        cd messages
        npm install

* Download and install [Microsoft Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator)

* Copy .env.example to .env and fill in enviroment variables

        NODE_ENV=
        MicrosoftAppId=
        MicrosoftAppPassword=
        BotStateEndpoint=
        BotOpenIdMetadata=
        LuisAppId=
        LuisAPIKey=
        LuisAPIHostName=
        LuisVersion=
        MTL_API_ENDPOINT=
        MTL_API_SUBSCRIPTION_KEY=
        FILESTACK_KEY=
        CLOUDINARY_ID=

* CLOUDINARY_ID can be obtained from [http://cloudinary.com/](http://cloudinary.com/)
* FILESTACK_KEY can be obtained from [https://www.filestack.com/](https://www.filestack.com/)
* MTL\_API\_ENDPOINT and MTL\_API\_SUBSCRIPTION\_KEY can be obtained from [https://developer.mirrorthatlook.com/](https://developer.mirrorthatlook.com/)
* LuisAppId, LuisAPIKey, LuisAPIHostName and LuisVersion can be obtained from [https://www.luis.ai/](https://www.luis.ai/)
        
* Start the server

        cd messages
        NODE_ENV=development node index.js

* Open Microsoft Bot Framework Emulator, input the endpoint and start chatting

# Docs

* For more detail description, please see [MIRRORTHATLOOK.md](MIRRORTHATLOOK.md)