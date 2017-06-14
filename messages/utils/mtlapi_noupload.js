/**
 * Wrapper file for calls to MTL API
 */

const request = require('request-promise').defaults({encoding: null});

function mtlmirrorthatlook (base_url, imageUrl, gender, optionals, api_key) {
    let fullURL = `${base_url}?image=${encodeURIComponent(imageUrl)}&gender=${gender}`;
    if (Object.keys(optionals).length) {
        let optionString ='';
        for (opt in optionals) {
          optionString = `${optionString}&${opt}=${optionals[opt]}`;
        }
        fullURL += optionString;
    }
    let options = {
        uri: fullURL,
        headers: {
            'Ocp-Apim-Subscription-Key': api_key
        },
        json: true
    };
    return request(options)
    .then(function(mtlFullJson) {
      // Only extract basic info from products
      let clothingTypes = Object.keys(mtlFullJson.result);
      let basicInfoJson = {};
      for (let ctype of clothingTypes) {
        basicInfoJson[ctype] = mtlFullJson
          .result[ctype]['products'].map(function(product) {
            basicProduct = {};
            basicProduct.name = product.name;
            basicProduct.price = product.price;
            basicProduct.salePrice = product.salePrice;
            basicProduct.retailer = product.retailer;
            basicProduct.description = product.description;
            basicProduct.clickUrl = product.clickUrl;
            basicProduct.image = product.images[0];
            return basicProduct;
          });
      }
      return basicInfoJson;
    });
};

exports.mtlmirrorthatlook = mtlmirrorthatlook;