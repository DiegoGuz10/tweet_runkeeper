
var allTweetsArray = []

function parseTweets(runkeeper_tweets) {
	// Parses the an array of all of the tweets to a new array 
	
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at)
	});

	tweet_array.forEach(element => {
		if(element.written === true) {
			allTweetsArray.push({
				tweet_activity: element.activityType,
				tweet_text: element.textwithLink,
			});
		}
	});

	console.log(allTweetsArray)
}

function addEventHandlerForSearch() {
	// Parses an array of tweets to find any that match with a search term and updates the table accordingly 
	
	var searchText = ""
    theIndex = 1
	
	$("#textFilter").on("keyup", function(event){
		$('#searchText').text($('#textFilter').val());
		searchText = $('#searchText').text();

		var filtered_Array = allTweetsArray.filter(function(element) {
			return element.tweet_text.includes(searchText);
		});

		$('#searchCount').text(filtered_Array.length);
		let tweetTableElem = $("#tweetTable")
		tweetTableElem.empty()

		filtered_Array.forEach(element => {
			let newRows = "<tr>";
			let tweetNum = "<td>" + theIndex + "</td>"; 
			newRows += tweetNum;
			theIndex += 1
			let the_tweet = "<td>" + element.tweet_text + "</td>"; 
			newRows += the_tweet;
			let activityType = "<td>" + element.tweet_activity + "</td>"; 
			newRows += activityType;
			newRows += "</tr>"
			tweetTableElem.append(newRows);
		});
		theIndex = 1

		if(searchText===""){
			tweetTableElem.empty();
			$('#searchCount').text(0);
		}
	});
}

document.addEventListener('DOMContentLoaded', function (event) {
	// Waits for the DOM to load
	
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets)

});
