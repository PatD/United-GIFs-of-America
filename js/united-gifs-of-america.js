// Global currently active Name and ID
// Shared between select and map clickers
var stateFullName;
var stateID;

// Global variable: End user's Favorite State
  // localStorage sets this if the user set one in the last session
var myFavoriteState = localStorage.favoriteState;
var myFavoriteStateID = localStorage.favoriteStateID;

// Global location
var myLat = 0;
var myLong = 0;

/// Global my state variable
var usersHomeState = "America";



  // GPS loading icon
  var geoLoadingIcon = document.getElementById("geoLoadingIcon");

  // Green GPS button - shown on mobile only
  var getGPScoordsButton = document.getElementById("getGPScoordsButton");
  
  // Box that holds GPS button
  var geoLocationBlock = document.getElementById("geoLocationBlock");
  
  // About link
  var aboutLink = document.getElementById("aboutLink");
  var aboutModalImage = document.getElementById("aboutModalImage");

  // Dropdown where we want our states added
  var fiftyStatesDropdown = document.getElementById("fiftyStatesDropdown");

  // Save Button in Modal
  var saveButton = document.getElementById("myOfficialStateSaver");
  
  // location of SVG map
  const svgamericamap = document.getElementById("SVGAMERICA");
  
  // Selects all the child nodes of SVGMAP
  //var mapchild = svgamericamap.children;
  var mapchild = svgamericamap.getElementsByTagName('path');
  
  
  // State name text node
  var stateNameHeader = document.getElementById("stateNameHeader");
  var stateNameInline = document.getElementById("stateInlineforModal");
  
  
  // Image + text where per-state-gif lands
  var stateGifHolder = document.getElementById("stateGifHolder");
  var stateTitleforModal = document.getElementById("stateTitleforModal");



  // Loading GIF for modal
  const loadingGif = "loading-america.gif";
  
  // Default fills color of SVG Map
  const mapColor = "#fff";
  const mapColorFavorite = "url(#favoriteStateBackgroundImage)";





// Function: Checks if state is in localStorage, and selects the state on map
var onLoadState = function(){
  
  // If Local Storage has stuff
  if (localStorage.getItem("favoriteStateID") !== null && localStorage.getItem("favoriteStateID") !== undefined) {
    
    var onLoadFavoriteStateNode = document.getElementById(myFavoriteStateID);
    
    onLoadFavoriteStateNode.setAttribute("favorite", "true");
    onLoadFavoriteStateNode.setAttribute("fill", mapColorFavorite);
  
    // console.log("Local storage has stuff it in!");
  }
  // If it's empty
  else{
     // console.log("Local Storage is null or undefined");
   
  };
};

// Function: removes any previously selected favorite state.
var makeStateUnfavorite = function(){
  
  // If local storage isn't empty...
   if (localStorage.getItem("favoriteStateID") !== null && localStorage.getItem("favoriteStateID") !== undefined) {
    
    var oldFavoriteStateID = localStorage.getItem('favoriteStateID');
    var oldFavoriteStateNode = document.getElementById(oldFavoriteStateID);
    
    // Remove favorite attribute
    oldFavoriteStateNode.removeAttribute("favorite");
    
    // Returns color to normal
    oldFavoriteStateNode.setAttribute("fill", mapColor);
  };
  
};

// Function: Marks the 'Save As Favorite' button saved
var markSavedonButton = function(){
  saveButton.className = 'btn btn-primary';
  saveButton.setAttribute('disabled',true);
  saveButton.textContent = 'Saved!';
};

// Function: Marks the 'Save As Favorite' button saved
var resetSavedonButton = function(){
  saveButton.className = 'btn btn-success';
  saveButton.removeAttribute('disabled');
  saveButton.textContent = 'Save as my Official State GIF';
};

// Function: Saves selected state to local storage. Updates map.
var savemyState = function(passedStateName, passedStateID){
  
    // Checks if we're not already the favorite
    if(passedStateID !== localStorage.getItem('favoriteStateID')){
      
      // Show the Save button, in case it was invisible
      if (saveButton.className == 'invisible'){
        saveButton.className = 'btn btn-success';
      }
      
      // Adds event listener for clicking save
      saveButton.addEventListener("click", function handler(){
        
        // Tell user it's done right away!
        markSavedonButton();
        
        // removes any existing favorite
        makeStateUnfavorite();
      
        // If we leave this line in, we can only use the button once? 
        // this.removeEventListener('click', handler);
        
        // Put our passed value into local storage!
        localStorage.setItem('favoriteState', passedStateName);
        localStorage.setItem('favoriteStateID', passedStateID);
        
        // The state which we just selected to be favorite, color it in!
        var mySelectedStateID = document.getElementById(passedStateID);
        
        // Colors in our fav state
        mySelectedStateID.setAttribute("fill", mapColorFavorite);
    
        // This state we just selected to be favorite, add an attribute mark it so
        mySelectedStateID.setAttribute("favorite", "true");
    
      });
    }
    
    // If we re-open our favorite state, the save button is not shown
    else{
      saveButton.className = 'invisible';
    }
  
};

// Helper function to find our location.
// Callback returns lat and Long
var getOurLocation = function(loc) {
  
  getGPScoordsButton.addEventListener("click",function(){ 
  
    if(document.documentElement.clientWidth < 1024 && navigator.geolocation){
    
      // Shows loading icon
      geoLoadingIcon.style.cssText="display:block;";
    
      navigator.geolocation.getCurrentPosition(
        
        function (position) {
          var returnValue = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          //  return loc with our coords
          loc(returnValue);
        
        });
    }
    else{
      console.log("Error in Geolocation, or yer screen's too big");
    } // if statement
  
  
  });  // event listener
};

// Function: Find our state, based on GPS coords
// Relies on global myLat and myLat
var getOurState = function(){
  
  var mapServiceCall = "https://nominatim.openstreetmap.org/reverse?pdoran@gmail.com&zoom=8&format=json&lat=" + myLat + "&lon=" + myLong;

  req = new XMLHttpRequest();
  req.open('GET', mapServiceCall);
  req.send();
  
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      var _returnedAddress =JSON.parse(this.responseText);
        usersHomeState = _returnedAddress.address.state;
        
        getGif(usersHomeState);
        
        selectBoxSettoState(usersHomeState);
        
        // Hide loading icon
        geoLoadingIcon.style.cssText="display:none;";
    };
  };

};

// Function: Changes dropdown to match geolocated state
var selectBoxSettoState = function(){
      
  for (var i = 0; i < fiftyStatesDropdown.options.length; i++) {
      if (fiftyStatesDropdown.options[i].text === usersHomeState) {
          fiftyStatesDropdown.selectedIndex = i;
          break;
      };
  };
};

// Function to create a dropdown from the values of the SVG map
var makeMapValuesIntoDropdown = function(){

  
  // Shows GPS button if device has capability
  if(navigator.geolocation){
    geoLocationBlock.setAttribute("id","gpsblockVisible");
  };
  
  
  // Place our States in this Array
  var _stateArray = ["<option selected disabled>Choose Your State</option>"];
  
  // Loops through each state, gathers ID and name, puts in an <option> tag
  for(var i=0;i < mapchild.length; i++){
    
    var _stateID = mapchild[i].getAttribute("data-id");
    var _stateName = mapchild[i].getAttribute("data-name");
    var _stateOptionNode = "<option value=" + _stateID + ">" + _stateName + "</option>";
   
    //  Adds <options> to _stateArray 
    _stateArray.push(_stateOptionNode);
  };

  // Sorts array alphabetically
  _stateArray.sort();

  // converts array to String, puts it in the select 
  var stateArrayString = _stateArray.toString();
  fiftyStatesDropdown.innerHTML = stateArrayString;
};


// Function: Fires when select-optioned or clicked to show a GIF
var loadLauncher = function(statePassed, stateIDPassed){

  // Clears already loaded GIF if there is one
  // So it doesn't show up accidentally for fast-clickers
  stateGifHolder.setAttribute("src", loadingGif);
  
  // Fixes our saved button
  resetSavedonButton();
  
  // Modal content text updates
  stateNameHeader.textContent = statePassed;
  stateNameInline.textContent = statePassed;
  
 
  // Adds event listener for save the state
  savemyState(statePassed,stateIDPassed);
  
};


// Function: Fires GIF modal for the selected state when selected on dropdown
var loadStateonSelect = function(){
  
  fiftyStatesDropdown.onchange = function(){

    // Sets global variables
    stateID = this.options[this.selectedIndex].value;
    stateFullName = this.options[this.selectedIndex].text;
    
    var chosenoption=this.options[this.selectedIndex];
    chosenoption.setAttribute("selected","selected");
    
    // fires function to load gif via modal
    getGif(stateFullName);

    // Preps modal
    loadLauncher(stateFullName,stateID);
  };
};



// Function: Handles Map hover, click, loading modal
var mapEventSetter = function(){
    
    // Loop through the states
    for(var i = 0; i < mapchild.length; i++){

    // Mouseover event handler
      mapchild[i].addEventListener("mouseover", function(){
  
          var stateFullName = this.getAttribute("data-name");
          
          // sets text header to state name
          stateNameHeader.textContent = stateFullName;
          
          // Clears already loaded GIF if there is one
          stateGifHolder.setAttribute("src", loadingGif);
      
      }); // End mouseover function
      
      
    // Mouseout event handler
      mapchild[i].addEventListener("mouseout", function(){

        var stateFullName = this.getAttribute("data-name");
        
        // removes state name from h2
        stateNameHeader.textContent = "";
      }); // End mosueout function
      
      
      // Event listener for click
      mapchild[i].addEventListener("click", function(){
      
        // What the state and ID are here:
        stateFullName = this.getAttribute("data-name");
        stateID = this.getAttribute("data-id");
        
        loadLauncher(stateFullName,stateID);

        // pass name to getGif function
        getGif(stateFullName);
        
       });
     
    }; // for loop per dom element in map

};  
    

// Service that loads from Giphy.  Expects name of state as parameter.
// Also handles modal
  
var getGif = function(stateFullName){
    
    const apiKey = "aVQW6huGskVxySOEzHumpxui59sYsGmX";
    var stateFullName = stateFullName;
    const loadGifs = new XMLHttpRequest();

    loadGifs.onreadystatechange = function() {
      
      if (this.readyState == 4 && this.status == 200) {
       
        var returnedGifs = JSON.parse(this.responseText);

        // Actual GIF
        var mainGif = returnedGifs.data[0].images.original.url;
      
        // Title in modal:
        stateTitleforModal.innerHTML=stateFullName;
        stateNameInline.innerHTML=stateFullName;

        // Sets SRC of image in Modal to value from GIFFY feed
        stateGifHolder.setAttribute("src",mainGif);
         
        // Fires modal dialog box
        $('#stateModal').modal('show')
      
        } // if
        
        else{
          // Error handling
        // console.log("Loading GIF from giphy");
        }
      };
  
      loadGifs.open("GET", "https://api.giphy.com/v1/gifs/search?q=" + stateFullName + "&api_key="+ apiKey +"&limit=1");
      loadGifs.send();
   }; // getgif


// Open about modal
// Uses Bootstrap modal 
    
var openAboutModal = function(){
  aboutLink.addEventListener("click", function(){
    
    // Lazy loads About GIF
    var _imageSrc = aboutModalImage.getAttribute("data-src");
    aboutModalImage.setAttribute("src",_imageSrc);
    
    // Bootstrap Modal load
    $('#aboutModal').modal('show')
  });  
};








// Waits for all content to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    
    onLoadState();
       
    // For mobile, makes a dropdown
      if(window.innerWidth < 769){
      
        makeMapValuesIntoDropdown();
      
        loadStateonSelect();
        
      // Here you pass a callback function as a parameter to `updateCoordinate`.
      
      getOurLocation(function (loc) {
          // sets global variables from returned vals
          myLat = loc.latitude;
          myLong = loc.longitude;
          getOurState();

      });
      
    };

    mapEventSetter();
    openAboutModal();

  }); // DOM loaded   