function formatDate(rawDate) {
	//Takes a date object and formats it into the following structure:
	//weekday, month dd, yyyy
	formattedDate = "";
	
	switch (rawDate.getDay()) {
		case 0:
			formattedDate += "Sunday, ";
			break;
		case 1:
			formattedDate += "Monday, ";
			break;
		case 2:
			formattedDate += "Tuesday, ";
			break;
		case 3:
			formattedDate += "Wednesday, ";
			break;
		case 4:
			formattedDate += "Thursday, ";
			break;
		case 5:
			formattedDate += "Friday, ";
			break;
		case 6:
			formattedDate += "Saturday, ";
			break;
		default:
			formattedDate += "ERROR ";
	}

	switch (rawDate.getMonth()) {
		case 0:
			formattedDate += "January "
			break;
		case 1:
			formattedDate += "February "
			break;
		case 2:
			formattedDate += "March "
			break;
		case 3:
			formattedDate += "April "
			break;
		case 4:
			formattedDate += "May "
			break;
		case 5:
			formattedDate += "June "
			break;
		case 6:
			formattedDate += "July "
			break;
		case 7:
			formattedDate += "August "
			break;
		case 8:
			formattedDate += "September "
			break;
		case 9:
			formattedDate += "October "
			break;
		case 10:
			formattedDate += "November "
			break;
		case 11:
			formattedDate += "December "
			break;
		default:
			formattedDate += "ERROR "
	}

	formattedDate += rawDate.getDate() + ", " + rawDate.getFullYear();
	return formattedDate;
}


function parseTweets(runkeeper_tweets) {
	// Parses through an array of tweets to find data about it.
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	var totalAmountofEvents = tweet_array.length;

	//retrieves the earliest and latest dates of tweets tagged runkeeper then formats them in the webpage
	firstDate = tweet_array[tweet_array.length-1].time; //to locale date string
	lastDate = tweet_array[0].time;
	$('#firstDate').text(formatDate(firstDate));
	$('#lastDate').text(formatDate(lastDate));

	//retrieves the total tweets flagged as completed, live, achievement, and miscellaneous
	var completedEventTotal = 0;
	var liveEventTotal = 0;
	var achievementTotal = 0;
	var miscellaneousTotal = 0;

	tweet_array.forEach(element => {
		if(element.source==="completed_event") { 
			completedEventTotal++; 
		}
		else if(element.source==="live_event") { 
			liveEventTotal++; 
		}
		else if(element.source==="achievement") { 
			achievementTotal++; 
		}
		else if(element.source==="miscellaneous") { 
			miscellaneousTotal++; 
		}
	});
	
	$('.completedEvents').text(completedEventTotal);
	$('.liveEvents').text(liveEventTotal);
	$('.achievements').text(achievementTotal);
	$('.miscellaneous').text(miscellaneousTotal);


	var completedEventTotalPercentage = 0;
	var liveEventTotalPercentage = 0;
	var achievementTotalPercentage = 0;
	var miscellaneousTotalPercentage = 0;

	completedEventTotalPercentage = ((parseFloat(completedEventTotal/totalAmountofEvents)) * 100).toFixed(2)+"%";
	liveEventTotalPercentage = ((parseFloat(liveEventTotal/totalAmountofEvents)) * 100).toFixed(2)+"%";
	achievementTotalPercentage = ((parseFloat(achievementTotal/totalAmountofEvents)) * 100).toFixed(2)+"%";
	miscellaneousTotalPercentage = ((parseFloat(miscellaneousTotal/totalAmountofEvents)) * 100).toFixed(2)+"%";
	
	$('.completedEventsPct').text(completedEventTotalPercentage);
	$('.liveEventsPct').text(liveEventTotalPercentage);
	$('.achievementsPct').text(achievementTotalPercentage);
	$('.miscellaneousPct').text(miscellaneousTotalPercentage);

	var UserWrittenTweetsTotal = 0;
	var UserWrittenTweetsPercentage = 0;

	tweet_array.forEach(element => {
		if(element.written===true) { 
			UserWrittenTweetsTotal++; 
		}
	});

	$('.written').text(UserWrittenTweetsTotal);
	UserWrittenTweetsPercentage = ((parseFloat(UserWrittenTweetsTotal/completedEventTotal)) * 100).toFixed(2)+"%";
	$('.writtenPct').text(UserWrittenTweetsPercentage);

}

document.addEventListener('DOMContentLoaded', function (event) {
	// Waits for the DOM to load

	loadSavedRunkeeperTweets().then(parseTweets);
});



//RESOURCES:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
