var qs = require('querystring'),
    request = require('request'),
    url = require('url')

/*
  SearchCache Setup
  This module caches the results on your locally running redis server
  If redis is not running on your machine, it will not fail however.
  If redis is running on the same machine as this node module, you 
  might want to leverage the caching benefits by using the flag
  useCache while fetching place details.
*/
try{
  var SearchCache = require('redis').createClient()
  SearchCache.select(7, function (error) {
    if (error) {
      throw "SearchCache Setup Failed!!"
    }
    else {
     console.log("info: SearchCache setup successfully.")
    }
  })

  var saveToSearchCache = function (placeId, placeDetails) {
    SearchCache.set('place:' + placeId, placeDetails, function (error) {
      if (error) {
        console.log("SearchCache.save:", error)
      }
    })
  }
} catch(e){
  // DO NOTHING
}

// This search function encapsulates 3 different APIs of the google places library
// namely: nearbysearch, textsearch and radarsearch.
// Use searchType variable to choose the one you need
// Make sure the arguments you pass according to the searchType are valid ones
// For detailed documentation, 
// see https://developers.google.com/places/documentation/search
function search(key, args, searchType, callback){
  return (function(key, args, callback){
    return makeRequest('/maps/api/place/' + searchType + 'search/json', key, args, true, returnObjectFromJSON(callback));
  })(key, args, callback);
}

function placeDetails(key, args, callback){
  if(args.useCache){
    SearchCache.get('place:' + args.placeid, function (err, result){
      if(err){
        callback(err)
      }
      else if(!result){
        delete args.useCache
        placeDetails(key, args, callback)
      }
      else{
        callback(null, JSON.parse(result))
      }
    })
  }
  else{
    var path = '/maps/api/place/details/json'
    return makeRequest(path, key, args, true, function (err, result){
      var result = JSON.parse(result).result
      console.log(result)
      if(err){
        callback(err);
      }
      else{
        if(result){
          try{
            saveToSearchCache(args.placeid, JSON.stringify(result));
          } catch(e){
            // DO NOTHING
          }          
        }
        callback(null, result)
      }
    })
  }
}

function placeAdd(key, body, callback){
  return makeRequest('/maps/api/place/add', key, null, true, returnObjectFromJSON(callback), null, 'POST', body)
}

function placeDelete(key, place_id, callback){
  return makeRequest('/maps/api/place/delete', key, null, true, returnObjectFromJSON(callback), null, 'POST', {
    'place_id':  place_id
  })
}

function placePhotos(key, args, callback){
  return makeRequest('/maps/api/place/photo', key, args, true, returnObjectFromJSON(callback));
}

function autocomplete(key, args, callback){
  return makeRequest('/maps/api/place/autocomplete/json', key, args, true, returnObjectFromJSON(callback));
}

function queryautocomplete(key, args, callback){
  return makeRequest('/maps/api/place/queryautocomplete/json', key, args, true, returnObjectFromJSON(callback));
}

function returnObjectFromJSON(callback) {
  if (typeof callback === 'function') {
    return function(err, jsonString) {
      if (err){
        callback(err);
        return;
      }
      try {
        callback(err, JSON.parse(jsonString));
      } catch (e) {
        callback(e);
      }
    };
  }
  return false;
};


function buildUrl(path, key, args) {
  return path + "?" + 'key='+ key + '&' +qs.stringify(args);
}

// Makes the request to Google Maps API.
// If secure is true, uses https. Otherwise http is used.
function makeRequest(path, key, args, secure, callback, encoding, method, body) {
  var maxlen = 2048;
  path = buildUrl(path, key, args);

  if (path.length > maxlen) {
    error = new Error("Request too long for google to handle (" + maxlen + " characters).");
    if (typeof callback === 'function') {
      return callback(error);
    } else {
      throw error;    
    }
  }

  var options = {
    method: method || 'GET',
    body: body,
    uri: (secure ? 'https' : 'http') + '://maps.googleapis.com' + path
  };

  console.log(options);

  if (encoding) options.encoding = encoding;
  // if (config('proxy')) options.proxy = config('proxy');

  if (typeof callback === 'function') {
    request(options, function (error, res, data) {
      if (error) {
        callback(error);
      }
      else if (res.statusCode === 200) {
        callback(null, data);
      }
      else{
        error = new Error(data);
        error.code = res.statusCode;
        callback(error, data);
      }
    });
  }
  else{
    return options.uri;  
  }
}

module.exports = {
  search: search,
  placeDetails: placeDetails,
  placeAdd: placeAdd,
  placeDelete: placeDelete,
  placePhotos: placePhotos,
  autocomplete: autocomplete,
  queryautocomplete: queryautocomplete
};