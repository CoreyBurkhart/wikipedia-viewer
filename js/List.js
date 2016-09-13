function List() {
    //a method for makeing a list item and adding content to it
    //based on the screen width it should specify expanded or not; also whether there should be an iframe or not

    this.elements = [];
    //adds content to list items based on user input

    this.searchForThumbnail = function(resultData) {
        var resultNumber = resultData.length;
        var resultTitles = resultData.join("|");

        $.ajax({
            url: "https://en.wikipedia.org/w/api.php",
            data: {
                "action": "query",
                "format": "json",
                "prop": "pageimages|pageterms",
                "formatversion": 2,
                "pithumbsize": 300,
                "pilimit": resultNumber,
                "titles": resultTitles
            },
            dataType: 'jsonp',
            type: 'GET',
            success: function(data) {
                console.log(data);
                var orderedURLs = [];
                //result are not in order! nnnnooooooooo!
                //must confirm that "title" property matches the resultData
                resultData.forEach(function(ele) {
                    for (var i = 0; i < data.query.pages.length; i++) {
                        if (data.query.pages[i].title === ele) {
                            //if that has a provided url...
                            if (data.query.pages[i].hasOwnProperty("thumbnail")) {
                                //make an new array of urls that is actually in order
                                orderedURLs.push(data.query.pages[i].thumbnail.source);
                            } else {
                                //if the data doesn't have a url, just push an empty string to the array as a placeholder
                                orderedURLs.push("");
                            }
                        }
                    }
                });
                //yay! they're in order now, now to just insert them!
                var img = document.querySelectorAll(".thumbnail");
                console.log(img);
                for (var i = 0; i < orderedURLs.length; i++) {
                    img[i].src = orderedURLs[i];
                }
                console.log(orderedURLs);
            },
            error: function(err) {
                console.log(err);
            }
        });
    }

    //adds the formatted document fragments to the dom(ul)
    this.addListItemsToDOM = function(target) {
        this.elements[0].forEach(function(ele) {
            target.appendChild(ele);
        })
    }


    this.makeListItems = function(data) {
        var list_item;
        var para;
        var anchor;
        var icon;
        var img;
        var title;
        var docFrags = [];

        for (var i = 0; i < data[1].length; i++) {
            //by the end, we will have an array of document fragments, with each frag being a list item
            docFrags.push(document.createDocumentFragment());

            //create the elements
            list_item = document.createElement('li');
            icon = document.createElement("i");
            para = document.createElement("p");
            title = document.createElement("p");
            img = document.createElement("img");
            anchor = document.createElement("a");

            //Give the items the appropriate attributes
            list_item.className = "items";
            icon.className = "material-icons";
            para.className = "info-para";
            title.className = "title";
            img.className = "thumbnail";
            anchor.className = "toWiki";
            anchor.target = "_blank";

            //add the content
            icon.innerText = "exit_to_app";
            title.innerText = data[1][i];
            para.innerText = data[2][i];
            anchor.href = data[3][i];

            //add event listener for expanding list items
            list_item.addEventListener('click', function() {
                if (this.className.includes("expanded")) {
                    this.classList.remove("expanded");
                } else {
                    //give the clicked list item the class expanded
                    this.className += " expanded";
                }
            });


            //put it all together
            anchor.appendChild(icon);
            list_item.appendChild(anchor);
            list_item.appendChild(img);
            list_item.appendChild(title);
            list_item.appendChild(para);
            docFrags[i].appendChild(list_item);
        }
        this.elements.push(docFrags);
        console.log(this.elements);
    }
}
