var monsters = ["wendigo", "warg", "werewolf", "basilisk", "wyvern", "golem",
    "gargoyle", "harpy", "ghoul", "hag", "witch", "vampire", "ghost", "troll",
    "sylvan", "banshee", "wraith"];
var searches = [];
var giphyAPI = "IOFiIPFiILbVnMVDYKgxwbRmMWluBOLN";
var buttonHolder = $("#search-buttons");
var gifHolder = $("#gif-holder");
var warnings = $("#warnings");

// Create a new button for each entry in the monsters and searches arrays. Add the
// button to the DOM.
function renderButtons() {
    warnings.empty();
    buttonHolder.empty();

    for (var i = 0; i < monsters.length; i++) {
        var button = $("<button>");
        button.attr("data-search", monsters[i]);
        button.text(monsters[i]);
        button.addClass("btn btn-dark mr-2 mb-2 search-for-me");
        buttonHolder.append(button);
    }
    if (searches.length > 0) {
        for (var i = 0; i < searches.length; i++) {
            var button = $("<button>");
            button.attr("data-search", searches[i]);
            button.text(searches[i]);
            button.addClass("btn btn-dark mr-2 mb-2 search-for-me");
            buttonHolder.append(button);
        }
    }
}

// When a button is clicked, search for the content of the button via the GIPHY API,
// and add the gifs to the screen.
$(document).on("click", ".search-for-me", function () {
    warnings.empty();
    gifHolder.empty();

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + $(this).attr("data-search") + "&api_key=" + giphyAPI + "&limit=10";

    // Query the Giphy API.
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        var searchResults = response.data;

        // For each gif in the response, create an <img> for it and add it to the DOM.
        for (var i = 0; i < searchResults.length; i++) {
            var gif = $("<img>");
            console.log(searchResults[i].images.fixed_height_still.url);
            gif.attr("src", searchResults[i].images.fixed_height_still.url);
            gif.attr("data-still", searchResults[i].images.fixed_height_still.url);
            gif.attr("data-animate", searchResults[i].images.fixed_height.url);
            gif.attr("data-state", "still");
            gif.addClass("gif mr-3 mb-3");
            gifHolder.append(gif);
        }
    });
});

// When a gif is clicked, switch it from still to animate, or animate to still.
$(document).on("click", ".gif", function () {
    warnings.empty();
    var clickedGif = $(this);

    if (clickedGif.attr("data-state") === "still") {
        clickedGif.attr("src", clickedGif.attr("data-animate"));
        clickedGif.attr("data-state", "animate");
    } else {
        clickedGif.attr("src", clickedGif.attr("data-still"));
        clickedGif.attr("data-state", "still");
    }
});

// When "Add GIF Button" is clicked, add the text box content as a button to the screen.
$("#add-a-gif").on("click", function (event) {
    event.preventDefault();

    warnings.empty();

    var input = $("#customSearch").val().trim().toLowerCase();

    console.log(input.toLowerCase());

    if (input === "") {
        warnings.append("<h3>You cannot search for nothing! Try again.</h3>");
    } else if (monsters.indexOf(input) === -1 && searches.indexOf(input) === -1) {
        searches.push(input);

        $("#customSearch").val("");

        renderButtons();
    } else {
        warnings.append("<h3>There is already a button for that; try again.</h3>");
        $("#customSearch").val("");
    }
});

renderButtons();