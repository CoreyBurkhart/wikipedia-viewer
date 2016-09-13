
var listItems;
var recentSearches = [];


function getRandomPage() {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php/w/api.php?action=query&format=json&prop=info&generator=random&inprop=url&grnnamespace=0",
        dataType: "jsonp",
        type: "GET",
        success: function(rdata) {
            console.log(rdata);
            //gets and sets button href to random wikipedia article
            var propName = Object.getOwnPropertyNames(rdata.query.pages).toString();
            var button = document.getElementById("random");
            button.href = rdata.query.pages[propName].fullurl;
        }
    });
}


function updateRecentSearches() {
    var check = document.getElementById("recent-searches");
    var div;
    var span;
    var heading;

    //if "recent-searches" div doesn't exist yet...
    if (!check) {
      //create a div for recent searches
        div = document.createElement("div");
        span = document.createElement("span");
        heading = document.createElement("h4");

        div.id = "recent-searches";
        span.className = "recent-search";
        heading.className = "recent-heading";

        heading.innerText = "Your Recent Searches";
        //make the first span what the user just searched for
        span.innerText = recentSearches[0];
        //add click event to bring user back to previous search results
        span.addEventListener("click", function() {
            openSearch(this.innerText);
        });

        //put everything together and insert it
        div.appendChild(heading);
        div.appendChild(span);
        $(".input-headers").after(div);
    } else {
      //if the div already exists, just add a new span w/ event listener
        span = document.createElement("span");
        span.className = "recent-search";
        span.innerText = recentSearches[0];

        span.addEventListener("click", function() {
            openSearch(this.innerText);
        })
        div = document.getElementById("recent-searches");
        div.appendChild(span);
    }
    //clear the seachbox since we just saved their seach
    document.getElementById("input").value = "";
}


//this is where we search for the answers to life! and answers to a users input
function openSearch(userInput) {
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        data: {
            "action": "opensearch",
            "format": "json",
            "search": userInput
        },
        dataType: 'jsonp',
        type: 'GET',
        success: function(data) {
            console.log(data);
            if (!data.error && data[1].length != 0 && data[0].length != 0) {

                //Do some randoms stuff
                $(".error-flag").remove();
                $("footer").css("position", "static");

                //get the parent and children so they can be deleted
                var parent = document.querySelector(".list");
                console.log("childnodes: ", parent.childNodes);
                //find out how many children there are, if any
                //if there are any, delete them all!
                while (parent.childNodes.length != 0) {
                    parent.removeChild(parent.childNodes[0]);
                }

                //make a new List obj with data for current search
                listItems = new List();
                //call method that makes the list items with some of the data
                listItems.makeListItems(data);
                //add the listitems to the document providing the list as a target to append the children to
                listItems.addListItemsToDOM(parent);
                //search for the thumbnails passing it the list of titles returned
                listItems.searchForThumbnail(data[1]);

                //if the users input hasn't already been searched for, add it to the recent searches
                if (!recentSearches.includes(userInput)) {
                    recentSearches.unshift(userInput);
                    updateRecentSearches();
                }
            } else {
                throwErrorFlag("No results found");
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

//shows errors, self explanatory
function throwErrorFlag(string) {
   $(".error-flag").remove();
    var div = document.createElement("div");
    div.className = "error-flag";
    div.innerText = string;

    $(".input-headers").after(div);
    console.log("threw error flag");
}

$(document).ready(function() {
   //gets initial random page
    getRandomPage();

    //User search interaction function
    $(document).keyup(function(e) {
        if (e.which === 13) {
            //get the value of the input field and send API request
            var input = document.getElementById("input").value;
            if (input.length > 1) {
                openSearch(input);
            } else {
                throwErrorFlag("You've gotta type something dude...");
            }

            var input_headers = document.querySelector(".input-headers");
            //if it's the first time searching for something add appropriate class to move the search to the top
            if (!input_headers.classList.contains("searched")) {
                input_headers.className += " searched";
                }
        } else if (e.which === 27) {
            document.getElementById("input").value = "";
        }
    });

    //clears text when little x in seachbox is pressed
    $(".clear").click(function() {
        document.getElementById("input").value = "";
        $("#input").focus();
    });

    //get's a new random page
    $("#random").click(function() {
        getRandomPage();
    })
});
