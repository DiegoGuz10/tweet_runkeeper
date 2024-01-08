"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    get source() {
        // Returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous' for each tweet
        if (this.text.includes("Achieved")) {
            return "achievement";
        }
        else if ((this.text.includes("completed")) || (this.text.includes("posted"))) {
            return "completed_event";
        }
        else if (this.text.substring(0, 8) == "Watch my") {
            return "live_event";
        }
        else {
            return "miscellaneous";
        }
    }
    get written() {
        // Returns true if a tweet is user-written. Otherwise, returns false is is not user-written 
        if (this.text.includes("-")) {
            return true;
        }
        else {
            return false;
        }
    }
    get writtenText() {
        // Returns the written text of a user-written tweet 
        var parsedStringwHashtag = "";
        var parsedStringwoHashtag = "";
        if (this.written == true) {
            parsedStringwHashtag = this.text.split(" - ")[1];
            parsedStringwoHashtag = parsedStringwHashtag.split(" https://")[0];
        }
        else {
            return "";
        }
        return parsedStringwoHashtag;
    }
    get activityType() {
        // Returns a the activity type of a tweet 
        var lowerCaseText = this.text.toLowerCase();
        if (this.source != 'completed_event') {
            return "unknown";
        }
        else if (lowerCaseText.includes(" run ")) {
            return "run";
        }
        else if (lowerCaseText.includes(" walk ")) {
            return "walk";
        }
        else if (lowerCaseText.includes(" bike ")) {
            return "bike";
        }
        return "";
    }
    get allactivityType() {
        // Returns a the activity type of a tweet 
        var lowerCaseText = this.text.toLowerCase();
        if (this.source != 'completed_event') {
            return "unknown";
        }
        else if (lowerCaseText.includes(" run ")) {
            return "run";
        }
        else if (lowerCaseText.includes(" hike ")) {
            return "hike";
        }
        else if (lowerCaseText.includes(" yoga ")) {
            return "yoga";
        }
        else if (lowerCaseText.includes(" walk ")) {
            return "walk";
        }
        else if (lowerCaseText.includes(" bike ")) {
            return "bike";
        }
        else if (lowerCaseText.includes(" row ")) {
            return "row";
        }
        else if (lowerCaseText.includes(" ski run ")) {
            return "ski run";
        }
        else if (lowerCaseText.includes(" mysports freestyle ")) {
            return "mysports freestyle";
        }
        else if (lowerCaseText.includes(" mysports gym ")) {
            return "mysports gym";
        }
        else if (lowerCaseText.includes(" workout ")) {
            return "workout";
        }
        else if (lowerCaseText.includes(" swim ")) {
            return "swim";
        }
        else if (lowerCaseText.includes(" meditation ")) {
            return "meditation";
        }
        else if (lowerCaseText.includes(" activity ")) {
            return "activity";
        }
        else if (lowerCaseText.includes(" chair ride ")) {
            return "chair ride";
        }
        else if (lowerCaseText.includes(" pilates session ")) {
            return "pilates session";
        }
        else if (lowerCaseText.includes(" skate ")) {
            return "skate";
        }
        else if (lowerCaseText.includes(" snowboard ")) {
            return "snowboard";
        }
        else if (lowerCaseText.includes(" boxing / mma ")) {
            return "boxing/mma session";
        }
        else if (lowerCaseText.includes(" sports ")) {
            return "sports session";
        }
        else if (lowerCaseText.includes(" dance ")) {
            return "dance";
        }
        return "";
    }
    get distance() {
        // Returns the distance from a tweet
        var lowerCaseText = this.text.toLowerCase();
        var SplitStrList;
        var KMorMILocation;
        var distanceStr = "";
        var distanceNum = 0;
        if (lowerCaseText.includes(" km ")) {
            SplitStrList = lowerCaseText.split(" ");
            KMorMILocation = SplitStrList.indexOf("km");
            distanceStr = SplitStrList[KMorMILocation - 1];
            distanceNum = Number(distanceStr) / 1.609;
        }
        else if (lowerCaseText.includes(" mi ")) {
            SplitStrList = lowerCaseText.split(" ");
            KMorMILocation = SplitStrList.indexOf("mi");
            distanceStr = SplitStrList[KMorMILocation - 1];
            distanceNum = Number(distanceStr);
        }
        return distanceNum;
    }
    get textwithLink() {
        // Returns the tweet's text with a clickable link
        var formattedlink = this.text.replace(/(https?:\/\/\S+)/g, '<a href="$1">$1</a>');
        return formattedlink;
    }
    getHTMLTableRow(rowNumber) {
        // Returns a row of a table for the descriptions page
        return "<tr></tr>";
    }
}
