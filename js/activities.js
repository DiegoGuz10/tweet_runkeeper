function numToDay(num) {
    //takes a number 0-6 and converts it to a 3-character day code
	// switch(num) {
	// 	case 0:
	// 		return "Sun";
	// 		break;
	// 	case 1:
	// 		return "Mon";
	// 		break;
	// 	case 2:
	// 		return "Tue";
	// 		break;
	// 	case 3:
	// 		return "Wed";
	// 		break;
	// 	case 4:
	// 		return "Thu";
	// 		break;
	// 	case 5:
	// 		return "Fri";
	// 		break;
	// 	case 6:
	// 		return "Sat";
	// 		break;
	// 	default:
	// 		return "ERROR";
	// }
    switch(num) {
		case 0:
			return "Sunday";
			break;
		case 1:
			return "Monday";
			break;
		case 2:
			return "Tuesday";
			break;
		case 3:
			return "Wednesday";
			break;
		case 4:
			return "Thursday";
			break;
		case 5:
			return "Friday";
			break;
		case 6:
			return "Saturday";
			break;
		default:
			return "ERROR";
	}
}

function calcLongActDay(actsArray) {
	//takes averageddistsarray and calculates the day in which people spent their longest activities
	let helperDTTArray = [];
	let daysToTimes = [];
	actsArray.forEach(function(act) {
		if (!helperDTTArray.includes(act.time)) {
			daysToTimes.push({
				day: act.time,
				time_total: act.average_distance
			});
		} else {
			for(var i=0; i<daysToTimes.length; i++) {
				if (daysToTimes[i]["day"] == act.day) {
					daysToTimes[i]["time_total"] += act.average_distance;
				}
			}
		}

		
	})
	
	let longestDay = "";
	let dist = 0;

	daysToTimes.forEach(function(dayTime) {
		if (dayTime["time_total"] > dist) {
			longestDay = dayTime["day"];
			dist = dayTime["time_total"];
		}
	})

	return longestDay;
}



function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if(runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }
   
    tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });


    //creates the array of data that will be taken by the activity_vis_spec
    var activityTypeArray = [];
    var helperActivityArray = [];
    tweet_array.forEach(function(tweet) {
        var key = tweet.activityType;
        if ((!helperActivityArray.includes(key)) && (key != "") && (key != "unknown")) {
            helperActivityArray.push(key);
            activityTypeArray.push({
                activity: key,
                amount: 1
            });
        } else {
            for (var i=0; i < activityTypeArray.length; i++) {
                if (activityTypeArray[i]["activity"] == key) {
                    activityTypeArray[i]["amount"]++;
                    break;
                }
            }
        }
    });

    //calculates the first-, second-, and third-most common types of activities
    var firstMost = "";
    var secondMost = "";
    var thirdMost = "";

    var first = 0;
    var second = 0;
    var third = 0;

    for (var i=0; i<activityTypeArray.length; i++) {
        var act = activityTypeArray[i]["activity"];
        var amt = activityTypeArray[i]["amount"];

        if (amt > first) {
            third = second;
            thirdMost = secondMost;

            second = first;
            secondMost = firstMost;

            first = amt;
            firstMost = act;        
        } else if (amt > second) {
            third = second;
            thirdMost = secondMost;

            second = amt;
            secondMost = act;
        } else if (amt > third) {
            third = amt;
            thirdMost = act;
        } else {
            continue;
        }
    }
   
    //creates the array of data that will be used by distByDay_vis_spec
	var distByDayArray = [];
    tweet_array.forEach(function(tweet) {
        if (tweet.activityType == firstMost ||
            tweet.activityType == secondMost ||
            tweet.activityType == thirdMost) {

				var day = numToDay(tweet.time.getDay());
                
                distByDayArray.push({
                    time: day,
                    distance: tweet.distance,
                    activity: tweet.activityType,
                    numTime: tweet.time.getDay()
                })
            }
    })

    //creates helper arrays meant for aiding in the creation of the third and final data array
    //calculates the averages for each time and day
    var helperDistsArray = [];
    var helpAverageArray = [];
    distByDayArray.forEach(function(tweet) {
        var activity = tweet.activity;
        var day = tweet.numTime;
        var checkerKey = activity + day;
        if (!helperDistsArray.includes(checkerKey)) {
            helperDistsArray.push(checkerKey);
            helpAverageArray.push({
                key: checkerKey,
				a: activity,
				d: day,
                distances: [tweet.distance]
            });
        } else {
            for (var i=0; i<helpAverageArray.length; i++) {
                if (helpAverageArray[i]["key"] == checkerKey) {
                    helpAverageArray[i]["distances"].push(tweet.distance);
                    break;
                }
            }
        }
    })

    //creates the array of data that will be used in averagedDists_vis_spec
    var averagedDistsArray = []; //FOR VEGA 3
    helpAverageArray.forEach(function(item) {
        var totalDists = 0.0;
        for (var i=0; i<item["distances"].length; i++) {
            totalDists += item["distances"][i];
        }
        averagedDistsArray.push({
            time: numToDay(item["d"]),
            average_distance: totalDists/item["distances"].length,
            activity: item["a"],
			numTime: item["d"]
        })
    })


    //creates the first graph, number of tweets containing each type of activity
    activity_vis_spec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "description": "A graph of the number of Tweets containing each type of activity.",
      "data": {"values": activityTypeArray},
      "mark": "point",
      "width": 400,
      "height": 250,
      "encoding": {
            "x": {
                "field": "activity",
                "type": "nominal",
                "title": "Type of Activity",
            },
            "y": {
                "field": "amount",
                "type": "quantitative",
				"scale": {
					"domain": [0, 5500]
				},
                "title": "Number of Tweets"
            }
        }
    };
    vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

    //creates the second graph, distances covered each day by the top three activities
    distByDay_vis_spec = {
        "$schema:": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A graph of the distances covered each day by the top three activities.",
        "data": {"values": distByDayArray},
        "mark": "point",
        "width": 400,
        "height": 250,
        "encoding": {
            "x": {
                "field": "time",
                "type": "nominal",
                "sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                // "sort": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				// "sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "title": "Day"
            },
            "y": {
                "field": "distance",
                "type": "quantitative",
				"scale": {
					"domain": [0, 300]
				},
                "title": "Distance (mi)"
            },
            "color": {
                "field": "activity",
                "type": "nominal"
            }
        }
    };
    vegaEmbed('#distanceVis', distByDay_vis_spec, {actions:false});
	
    //creates the third graph, average distances covered each day for the top three activities
    averageDists_vis_spec = {
        "$schema:": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A graph of the average distances covered each day for the top three activities.",
        "data": {"values": averagedDistsArray},
        "mark": "point",
        "width": 400,
        "height": 250,
        "encoding": {
            "x": {
                "field": "time",
                "type": "ordinal",
                "sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				//"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "title": "Day"
            },
            "y": {
                "field": "average_distance",
                "type": "quantitative",
				"scale": {
					"domain": [0, 15]
				},
                "title": "Average Distance (mi)"
            },
            "color": {
                "field": "activity",
                "type": "nominal"
            }
        }
    };
    vegaEmbed('#distanceVisAggregated', averageDists_vis_spec, {actions:false});
	
	$('#firstMost').text(firstMost);
	$('#secondMost').text(secondMost);
	$('#thirdMost').text(thirdMost);

	$('#numberActivities').text(activityTypeArray.length);
    $('#longestActivityType').text(firstMost);
    $('#shortestActivityType').text(thirdMost);

	var longestDay = calcLongActDay(averagedDistsArray);
    $('#weekdayOrWeekendLonger').text(longestDay); //when people did their longest activities BUT idk what that means lowkey

}

document.addEventListener('DOMContentLoaded', function (event) {
    // Waits for the DOM to load
    loadSavedRunkeeperTweets().then(parseTweets);

    //sets up the first view of the activities/html page
    $("#activityVis").show();
	$("#distanceVis").show();
	$("#distanceVisAggregated").hide();

    //listens for a button click, alternates the display of either the second or third graph
	$("#aggregate").on("click", function() {
		if ($("#distanceVisAggregated").css("display") == "none") {
			$("#distanceVis").css("display", "none");
			$("#distanceVisAggregated").css("display", "inline-block");
			$("#aggregate").html("Show All Activities");
		} else {
			$("#distanceVisAggregated").css("display", "none");
			$("#distanceVis").css("display", "inline-block");
			$("#aggregate").html("Show Means");
		}
	})

});


//RESOURCES:
// https://vega.github.io/vega-lite/docs/encoding.html#datum-def
// https://vega.github.io/vega-lite/examples/
// https://vega.github.io/vega-lite/examples/point_2d.html
// https://vega.github.io/vega-lite/docs/legend.html
// https://www.w3schools.com/jquery/jquery_intro.asp
// https://www.w3schools.com/jquery/jquery_syntax.asp
// https://www.w3schools.com/jquery/jquery_events.asp
// https://stackoverflow.com/questions/55134128/setting-a-maximum-axis-value-in-vega-lite
// https://api.jquery.com/click/
// https://stackoverflow.com/questions/27791484/jquery-css-method-not-working
// https://stackoverflow.com/questions/5580616/how-to-change-the-text-of-a-button-in-jquery


