Parse.Cloud.define('setOwnerRating', function(req, res) {
	Parse.Cloud.useMasterKey();
	var query = new Parse.Query(Parse.User);
	query.equalTo("username", req.params.ownerEmail);
	query.first({
		success: function(owner) {
			var sumRatings = owner.get("sumRatings");
			var numRatings = owner.get("numRatings");
			if(sumRatings == undefined) sumRatings = req.params.rating;
			else sumRatings += req.params.rating;

			if(numRatings == undefined) numRatings = 1;
		    	else numRatings++;

			owner.set("sumRatings", sumRatings);
			owner.set("numRatings", numRatings);
			owner.save(null, {
				success: function() {
					res.success("Successful save!");
				},
				error: function() {
					res.error("Error saving!");
				} 
			});	

		},
		error: function(error) {
			//Error Handling
		}
	});
});


Parse.Cloud.define('payRequest', function(req, res){
    var CLIENT_ID = 'ca_9UHlLmqGjG3bprqMMYz1GpJrXGvpX3ZG';
    var API_KEY = 'sk_test_46tPC5KonTnuuvz1dbl0Q7J7';

    var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
    var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';

    $http.post(AUTHORIZE_URI + "?response_type=code&client_id="+CLIENT_ID + "&scope=read_write")
        .success(
	    function(response) {
	    }
	)
        .error(
	    function(response) {
		response.send("Error");
	    }
	);
    $http.post("/oauth/callback", function(req, res) {
	var code = req.query.code;

	// Make /oauth/token endpoint POST reques
	request.post({
	    url: TOKEN_URI,
	    form: {
		grant_type: "authorization_code",
		client_id: CLIENT_ID,
		code: code,
		client_secret: API_KEY
	    }
	}, function(err, r, body) {

	    var accessToken = JSON.parse(body).access_token;

	    // Do something with your accessToken

	    // For demo"s sake, output in response:
	    res.send({ "Your Token": accessToken });

	});
    });
	
});
