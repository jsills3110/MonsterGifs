var monsters = ["wendigo", "warg", "werewolf", "basilisk", "wyvern", "golem",
    "gargoyle", "harpy", "ghoul", "hag", "witch", "vampire", "ghost", "troll",
    "sylvan", "banshee", "wraith"];
var favorites = [];
var searches = [];
var giphyAPI = "IOFiIPFiILbVnMVDYKgxwbRmMWluBOLN";
var buttonHolder = $("#search-buttons");
var gifHolder = $("#gif-holder");
var warnings = $("#warnings");

// Create a new button for each entry in the monsters and searches arrays. Add the
// button to the DOM.
function renderButtons() {
    warnings.empty(); // Clear the warnings div
    buttonHolder.empty(); // Clear the buttonHolder div

    var favoriteButton = $("<button>");
    favoriteButton.html("<i class='fas fa-star' style='color: rgb(253, 255, 153)'></i> Show Favorites");
    favoriteButton.addClass("btn btn-dark mr-2 mb-2");
    favoriteButton.attr("id", "show-favorites");
    buttonHolder.append(favoriteButton);

    // For each entry in the default monsters list...
    for (var i = 0; i < monsters.length; i++) {

        // Create a button with the details of that entry
        var button = $("<button>");
        button.attr("data-search", monsters[i]);
        button.text(monsters[i]);
        button.addClass("btn btn-dark mr-2 mb-2 search-for-me");
        buttonHolder.append(button);
    }

    // As long as the searches array is not empty...
    if (searches.length > 0) {

        // For each entry in the searches list...
        for (var i = 0; i < searches.length; i++) {

            // Create a button with the details of that entry
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
    warnings.empty(); // Clear the warnings div
    gifHolder.empty(); // Clear the gifHolder div

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + $(this).attr("data-search") + "&api_key=" + giphyAPI + "&limit=10";

    // Query the Giphy API.
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        var searchResults = response.data;

        // For each gif in the response, create an <img> for it and add it to the DOM.
        for (var i = 0; i < searchResults.length; i++) {
            // console.log(searchResults[i]);

            // Create a Bootstrap Card.
            var gifCard = $("<div>");
            gifCard.addClass("card d-inline-block mr-3 mb-3");
            gifCard.attr("style", "background-color: rgba(36, 40, 45, 0.8);");

            // Create a new image and set it to the gif.
            var gif = $("<img>");
            gif.attr("src", searchResults[i].images.fixed_height_still.url);
            gif.attr("data-still", searchResults[i].images.fixed_height_still.url);
            gif.attr("data-animate", searchResults[i].images.fixed_height.url);
            gif.attr("data-state", "still");
            gif.addClass("gif card-img-top mr-2 ml-2 mt-2");
            gif.attr("style", "width: auto;");

            // Create the Bootstrap Card body.
            var gifCardBody = $("<div>");
            gifCardBody.addClass("card-body");

            // Create the "Favorite" button.
            var favButton = $("<button>");
            favButton.addClass("btn btn-secondary d-inline-block mr-2 add-favorite");
            favButton.attr("data-not-favorite", "<i class='far fa-star' style='color: rgb(253, 255, 153)'></i>")
            favButton.attr("data-favorite", "<i class='fas fa-star' style='color: rgb(253, 255, 153)'></i>")
            favButton.attr("data-gif-id", searchResults[i].id);

            // If the gif is in the favorites list...
            if (favorites.indexOf(searchResults[i].id) !== -1) {
                    
                // Set the star to a solid star
                favButton.html("<i class='fas fa-star' style='color: rgb(253, 255, 153)'></i>");
                favButton.attr("data-state", "favorite");

            // If the gif is not in the favorites list...
            } else {
                
                // Set the star to a star outline
                favButton.html("<i class='far fa-star' style='color: rgb(253, 255, 153)'></i>");
                favButton.attr("data-state", "not-favorite");
            }

            // Append the card elements to the card, then append the card to gifHolder.
            gifCard.append(gif);
            gifCardBody.append(favButton);
            gifCardBody.append("<p class='card-text text-light d-inline-block'>Rating: " + searchResults[i].rating + "</p>")
            gifCard.append(gifCardBody)
            gifHolder.append(gifCard);
        }
    });
});

// When a gif is clicked, switch it from still to animate, or animate to still.
$(document).on("click", ".gif", function () {
    warnings.empty(); // Clear the warnings div
    var clickedGif = $(this);

    // If the current state of the gif is still...
    if (clickedGif.attr("data-state") === "still") {

        // Set the src to the animate url and set the state to animate
        clickedGif.attr("src", clickedGif.attr("data-animate"));
        clickedGif.attr("data-state", "animate");

        // If the current state of the gif is animate...
    } else {

        // Set the src to the still url and set the state to still
        clickedGif.attr("src", clickedGif.attr("data-still"));
        clickedGif.attr("data-state", "still");
    }
});

// When "Add GIF Button" is clicked, add the text box content as a button to the screen.
$("#add-a-gif").on("click", function (event) {
    event.preventDefault(); // Prevent the page from refreshing upon submit
    warnings.empty(); // Clear the warnings div

    // Grab the user's input from the textbox
    var input = $("#customSearch").val().trim().toLowerCase();

    // console.log(input.toLowerCase());

    // If the input is blank...
    if (input === "") {
        warnings.append("<h3>You cannot create a button with nothing! Try again.</h3>");

        // If the user has NOT already created a button for this search...
    } else if (monsters.indexOf(input) === -1 && searches.indexOf(input) === -1) {
        searches.push(input); // Add the search to our searches array
        $("#customSearch").val(""); // Reset the textbox to blank
        renderButtons(); // Render the new button list

        // If the user already created a button for this search...
    } else {
        warnings.append("<h3>There is already a button for that; try again.</h3>");
        $("#customSearch").val(""); // Reset the textbox to blank
    }
});

// When the Star button is clicked on a gif, then the gif will be added to a favorites
// list.
$(document).on("click", ".add-favorite", function () {
    var clickedFave = $(this);

    // If the current state of the favorite button is not-favorite...
    if (clickedFave.attr("data-state") === "not-favorite") {

        // Change the star from an outline to a solid star.
        clickedFave.html(clickedFave.attr("data-favorite"));
        clickedFave.attr("data-state", "favorite");

        // If the gif id is not already in the favorites list...
        if (favorites.indexOf(clickedFave.attr("data-gif-id")) === -1) {
            favorites.push(clickedFave.attr("data-gif-id"));
        }

        // If the current state of the favorite button is favorite...    
    } else {

        // Change the star from a solid star to an outline.
        clickedFave.html(clickedFave.attr("data-not-favorite"));
        clickedFave.attr("data-state", "not-favorite");

        // If the gif id is in the favorites list...
        if (favorites.indexOf(clickedFave.attr("data-gif-id")) !== -1) {
            favorites.splice(favorites.indexOf(clickedFave.attr("data-gif-id")), 1);
        }
    }

    localStorage.setItem("favorites", favorites);
});

// When the user clicks on Show Favorites, it will display the gifs that they have
// favorited.
$(document).on("click", "#show-favorites", function () {
    warnings.empty(); // Clear the warnings div
    gifHolder.empty(); // Clear the gifHolder div

    // favorites = localStorage.getItem("favorites");
    console.log(favorites);

    // If the favorites list has no favorites in it...
    if (favorites.length <= 0) {
        
        // Warn the user that they haven't favorited anything yet.
        warnings.append("<h3>You don't have any favorites yet!</h3>");
    
    // If the favorites list is not empty...
    } else {
        
        // For each gif in the favorites list, search for it via the Giphy API
        for (var i = 0; i < favorites.length; i++) {
            var queryURL = "https://api.giphy.com/v1/gifs/" + favorites[i] + "?api_key=" + giphyAPI;
            
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).then(function (response) {
                var image = response.data;

                // Create a Bootstrap Card.
                var gifCard = $("<div>");
                gifCard.addClass("card d-inline-block mr-3 mb-3");
                gifCard.attr("style", "background-color: rgba(36, 40, 45, 0.8);");

                // Create a new image and set it to the gif.
                var gif = $("<img>");
                gif.attr("src", image.images.fixed_height_still.url);
                gif.attr("data-still", image.images.fixed_height_still.url);
                gif.attr("data-animate", image.images.fixed_height.url);
                gif.attr("data-state", "still");
                gif.addClass("gif card-img-top mr-2 ml-2 mt-2");
                gif.attr("style", "width: auto;");

                // Create the Bootstrap Card body.
                var gifCardBody = $("<div>");
                gifCardBody.addClass("card-body");

                // Create the "Favorite" button.
                var favButton = $("<button>");
                favButton.addClass("btn btn-secondary d-inline-block mr-2 add-favorite");
                favButton.attr("data-not-favorite", "<i class='far fa-star' style='color: rgb(253, 255, 153)'></i>")
                favButton.attr("data-favorite", "<i class='fas fa-star' style='color: rgb(253, 255, 153)'></i>")
                favButton.attr("data-gif-id", image.id);

                // If the gif is in the favorites list...
                if (favorites.indexOf(image.id) !== -1) {
                    
                    // Set the star to a solid star
                    favButton.html("<i class='fas fa-star' style='color: rgb(253, 255, 153)'></i>");
                    favButton.attr("data-state", "favorite");

                // If the gif is not in the favorites list...
                } else {
                    
                    // Set the star to a star outline
                    favButton.html("<i class='far fa-star' style='color: rgb(253, 255, 153)'></i>");
                    favButton.attr("data-state", "not-favorite");
                }

                // Append the card elements to the card, then append the card to gifHolder.
                gifCard.append(gif);
                gifCardBody.append(favButton);
                gifCardBody.append("<p class='card-text text-light d-inline-block'>Rating: " + image.rating + "</p>")
                gifCard.append(gifCardBody)
                gifHolder.append(gifCard);
            });
        }
    }
});

// Render the default buttons upon page load.
renderButtons();