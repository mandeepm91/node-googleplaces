

var googleplaces = require('./index');

// var key = 'AIzaSyAO5VCss2Cruo-pCViJLV6SNNFT9pIMknA';

var key  = 'AIzaSyDyn2MgKXj0WX1sylzNIH1KkouwPLZ-amI'
var args = {
	location: "28.481170,77.085727",
	input: "pizza near central arcade",
	radius: 1000
}

googleplaces.queryautocomplete(key, args, function (err, result){
	console.log("calling search");
	if(err){
		console.error("error ", err);
	}
	else{
		console.log("success", result);
	}
});

var detailsArgs = {
	placeid: 'ChIJIQ3F0SUZDTkREYrPr6A84ZY',
	useCache: true
}

// googleplaces.placeDetails(key, detailsArgs, function (err, result){
// 	console.log("calling search");
// 	if(err){
// 		console.error("error ", err);
// 	}
// 	else{
// 		console.log("success", result);
// 	}
// });


// var photoArgs = {
// 	photoreference: 'CnRmAAAAknhwIYEebrj2DbTnEZgWnehkWVo11j_IMB914rdSUlmMV17dh0RBll5b_IqpGqtdVUm4QXksjG5K9-1H252JdeWlXPlCslBSMsH4CJXIfRbnRh9JHSQmSdcq7uOb414KWxnzMctNkvr0y7B2m9FAzBIQKk9Sy8eQSAAV881h116C7hoU0838xRH7CWMXA7LEnr3N6rIHQxA'
// }

// googleplaces.placePhotos(key, photoArgs, function (err, result){
// 	console.log("calling search");
// 	if(err){
// 		console.error("error ", err);
// 	}
// 	else{
// 		console.log("success", result);
// 	}
// });

// googleplaces.placeAdd(key, {'dummy': 1}, function (err, result){
// 	console.log("calling search");
// 	if(err){
// 		console.error("error ", err);
// 	}
// 	else{
// 		console.log("success", result);
// 	}	
// })


