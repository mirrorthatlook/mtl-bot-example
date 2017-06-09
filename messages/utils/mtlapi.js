/**
 * Wrapper file for calls to MTL API
 */

const request = require('request-promise').defaults({encoding: null});
var Filepicker = require('filepicker');
const FILESTACK_KEY = process.env.FILESTACK_KEY;

var filepicker = new Filepicker(FILESTACK_KEY);
function upload(imageURL, option) {
    return new Promise(function(resolve, reject) {
      filepicker.getUrlFromUrl(imageURL, {
        persist: true
      }, function(err, url) {
        resolve(url);
      });
    });
}

function mtlmirrorthatlook (base_url, imageURL, gender, optionals, api_key) {
    return upload(imageURL, {
      persist: true
    }).then(function(url){
      let fullURL = `${base_url}image=${encodeURIComponent(url)}&gender=${gender}`;
      if (Object.keys(optionals).length) {
        let optionString ='';
        for (opt in optionals) {
          optionString = `${optionString}&${opt}=${optionals[opt]}`;
        }
        fullURL += optionString;
      }
      console.log('fullURL',fullURL);
      let options = {
          uri: fullURL,
          headers: {
              'Ocp-Apim-Subscription-Key': api_key
          },
          json: true
      };
      return request(options);      
    }).then(function(mtlFullJson) {
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