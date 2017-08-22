/**
*
* RocketLaunchAPI.js handles all REST Api calls to https://launchlibrary.net/
*
*/

function RocketLaunchAPI() {
    this.url = "https://launchlibrary.net/1.2/";
    this.googleMaps = "http://maps.googleapis.com/maps/api/geocode/json"
    this.method = "GET"; // GET is only supported by launchlibrary
    this.monthsOut = 1; // default enddate
    this.limit = 10 // how many launches do we want returned
    this.prepLaunches = [];
}

RocketLaunchAPI.prototype = {
    constructor: RocketLaunchAPI,
    // returns prepared data to be used by our map
    getUpcomingLaunches: function(callback = null, startdate = null, enddate) {
        var self = this;
        if(startdate == null || enddate == null) {
            // get current date to start looking for launches
            startdate = this.getFormattedDate();
            // only look for launches 4 months out
            enddate = this.getFormattedDate(0,this.monthsOut,0);
            // lets add this to our users screen
            $(".title").html("Rocket Launches from " + startdate + " through " + enddate);
        }
        // data to be sent
        var params = {
            'startdate': startdate,
            'enddate': enddate,
            'limit': this.limit,
            'fields': [
                'location'
            ]
        }

		$.ajax({
			url: this.url + "launch",
		  	method: this.method,
		  	async: true,
		  	dataType: "json",
		  	data: params,
		  	success:function(response) {
                self.getSingleLaunch(response.launches, function(){
                    // after loop has finished, return our prepared data
                    if(callback) {
                        callback(self.prepLaunches);
                    }
                });
		  	},
		  	error: function(e) {
                console.log(e);
                if(callback) {
                    callback(e);
                }
		  	}
		});
    },
    /**
    *
    * returns single launch data
    *
    */
    getSingleLaunch: function(launches, callback = null) {
        var self = this;
        var lastKey = launches.length;
        var i = 0;
        // data to be sent
        var params = {
            'fields': [
                'location'
            ]
        }
        // now get individual launch information - we mainly care about the location
        for(key in launches) {    
            var launchID = launches[key].id;
            $.ajax({
                url: this.url + "launch/" + launchID,
                method: this.method,
                async: true,
                dataType: "json",
                data: params,
                success:function(response) {
                    // edit response to include the country name
                    self.getCountryName(response.launches[0].location.pads[0].longitude, response.launches[0].location.pads[0].latitude, function(geoinfo){
                        var country = geoinfo.results[ Object.keys(geoinfo.results).sort().pop() ];
                        response.launches[0].location.country = country.formatted_address;

                        var tmp = {
                            // there is only one item returned
                            'name': response.launches[0].name,
                            'country': response.launches[0].location.country,
                            'netlaunch': response.launches[0].net
                        }
                        // push to stack
                        self.prepLaunches.push(tmp);
                        // if we are at the end of our stack, return
                        if(lastKey == (i + 1)) {
                            if(callback) {
                                callback();
                            }
                        }
                        ++i;
                    });
                },
                error: function(e) {
                    console.log(e);
                    if(callback) {
                        callback(e);
                    }
                }
            });
        }
    },
    /**
    *
    * returns the country full name by using long/lat
    *
    */
    getCountryName: function(lng, lat, callback = null) {
        // data to be sent
        var params = {
            'latlng': lat + "," + lng
        }

		$.ajax({
			url: this.googleMaps,
		  	method: this.method,
		  	async: true,
		  	dataType: "json",
		  	data: params,
		  	success:function(response) {
                if(callback) {
                    callback(response);
                }
		  	},
		  	error: function(e) {
                console.log(e);
                if(callback) {
                    callback(response);
                }
		  	}
		});
    },
    // pass in optional incremental paramaters to adjust to future dates
    getFormattedDate: function(plusDays = 0, plusMonths = 0, plusYears = 0) {
        var time = new Date();
        time.setMonth(time.getMonth() + plusMonths);
        time.setDate(time.getDate() + plusDays);
        time.setFullYear(time.getFullYear() + plusYears);
        return time.toISOString().substring(0, 10);
    }
}