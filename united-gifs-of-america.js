

// Save Button in Modal
var saveButton = document.getElementById("myOfficialStateSaver");

// location of SVG map
const svgamericamap = document.getElementById("SVGAMERICA");

// State name text node
var stateNameHeader = document.getElementById("stateNameh2");

// Image + text where per-state-gif lands
var stateGifHolder = document.getElementById("stateGifHolder");
var stateTitleforModal = document.getElementById("stateTitleforModal");

// Loading GIF for modal
const loadingGif = "loading-america.gif";



// Default fills color of SVG Map
const mapColor = "#fff";
const mapColorHover = "#ff0000"
const mapColorFavorite = "url(#favoriteStateBackgroundImage";


// End user's Favorite State
// localStorage sets this if the user set one in the last session
var myFavoriteState = localStorage.favoriteState;
var myFavoriteStateID = localStorage.favoriteStateID
//console.log("global variable set: " + myFavoriteState + myFavoriteStateID);


// Helper function, checks to see if LocalStorage is?
function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
};

// If it's not available, 
if (!storageAvailable('localStorage')) {
   console.log("no local storage");
}



// Checks to see if there is anything in localStorage, and acts on it
function onLoadState(){
  var onLoadFavoriteStateNode = document.getElementById(myFavoriteStateID);
  onLoadFavoriteStateNode.setAttribute("favorite", "true");
  onLoadFavoriteStateNode.setAttribute("fill", mapColorFavorite);
};



// Remove any previously selected favorite state.
function makeStateUnfavorite(){
  var oldFavoriteStateID = localStorage.getItem('favoriteStateID');
  var oldFavoriteStateNode = document.getElementById(oldFavoriteStateID);
  
  // Remove favorite attribute
  oldFavoriteStateNode.removeAttribute("favorite");
  
  // Returns color to normal
  oldFavoriteStateNode.setAttribute("fill", mapColor);
};




// function to save selected state to myState variable, and to local storage
function savemyState(passedStateName, passedStateID){
  
    // Adds event listener for clicking save
    saveButton.addEventListener("click", function handler(){
      
      // removes any existing favorite
      makeStateUnfavorite();
    
      // If we leave this line in, we can only use the button once? 
      this.removeEventListener('click', handler);
      
      // Put our passed value into local storage!
      localStorage.setItem('favoriteState', passedStateName);
      localStorage.setItem('favoriteStateID', passedStateID);
      
      // The state which we just selected to be favorite, color it in!
      var mySelectedStateID = document.getElementById(passedStateID);
      mySelectedStateID.setAttribute("fill", mapColorFavorite);
  
      // This state we just selected to be favorite, add an attribute mark it so
      mySelectedStateID.setAttribute("favorite", "true");
  
    });
  
};





// URL for finding state
// http://nominatim.openstreetmap.org/reverse?format=xml&lat=35.7787429714954&lon=-78.6602098644987&pdoran@gmail.com&zoom=8&format=json&json_callback=myGeoState



var myLat;
var myLong;
var stateLookupService = "http://nominatim.openstreetmap.org/reverse?pdoran@gmail.com&zoom=8&format=json&json_callback=myGeoState&lat=" + myLat + "&lon=" + myLong;

console.log(stateLookupService)

// Check if we're on mobile





// Get state by geolocation, or allow user to find it w/a link

var options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

function geosuccess(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

navigator.geolocation.getCurrentPosition(geosuccess, error, options);


// pass lat  long to service

// Make the click function 









  // Waits for all content to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    
    // Local Storage Getterer
    onLoadState();
    
  
    // Selects all the child nodes of SVGMAP
    var mapchild = svgamericamap.children;
    
    // Loop through the states
    for(var i = 0; i < mapchild.length; i++){






    // Mouseover event handler
      mapchild[i].addEventListener("mouseover", function(){
        
          // Sets background color of state
          // if it's not our favorite
          if(!this.hasAttribute("favorite")){
            this.setAttribute("fill",mapColorHover);
          };

          
          var stateFullName = this.getAttribute("data-name");
          
          // sets text header to state name
          stateNameHeader.textContent = stateFullName;
          
          // Clears already loaded GIF if there is one
          // So it doesn't show up accidentally for fast-clickers
          stateGifHolder.setAttribute("src", loadingGif);
        
      }); // End mouseover function
      
      
      
  
      
    // Mouseout event handler
      mapchild[i].addEventListener("mouseout", function(){
        if(!this.hasAttribute("favorite")){
          this.setAttribute("fill",mapColor);
        };
      
         var stateFullName = this.getAttribute("data-name");
        
        // removes state name from h2
        stateNameHeader.textContent = "";
      }); // End mosueout function
      
      
      
      // Event listener for click
       mapchild[i].addEventListener("click", function(){
         
        // Clears already loaded GIF if there is one
        // So it doesn't show up accidentally for fast-clickers
        stateGifHolder.setAttribute("src", loadingGif);
         
        // What the state and ID are here:
        var stateFullName = this.getAttribute("data-name");
        var stateID = this.getAttribute("data-id");
         
        this.setAttribute("fill",mapColorHover);
          
          stateNameHeader.textContent = stateFullName;
        
          // Adds event listener for the state
          savemyState(stateFullName,stateID);
        
          // pass name to getGif function
         return getGif(stateFullName);
        
       });
     
    }; // for loop per dom element in map
   
    
    

    
    
    
    
    // Service that loads from Giffy.  Expects name of state as paramter
    // Also handles modal
    
    var getGif = function(stateFullName){
      
      const apiKey = "dc6zaTOxFJmzC";
      var stateFullName = stateFullName;
      const loadGifs = new XMLHttpRequest();

      loadGifs.onreadystatechange = function() {
        
        if (this.readyState == 4 && this.status == 200) {
         
          var returnedGifs = JSON.parse(this.responseText);
          
          // Thumbnail
          var smallGif = returnedGifs.data[0].images.downsized.url;
          
          // Actual GIF
          var mainGif = returnedGifs.data[0].images.original.url;
        
          
          // Title in modal:
          stateTitleforModal.innerHTML=stateFullName;
           
          // Sets SRC of image in Modal to value from GIFFY feed
          stateGifHolder.setAttribute("src",mainGif);
           
          // Fires modal dialog box
          $('#stateModal').modal('show')
          
          
      
           
          } // if
          
          else{
            // Error handling
            console.log("Waiting");
          }
        };
    
        loadGifs.open("GET", "http://api.giphy.com/v1/gifs/search?q=" + stateFullName + "&api_key="+ apiKey +"&limit=1");
        loadGifs.send();
     }; // getgif
    
  
  }); // DOM loaded