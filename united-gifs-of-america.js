

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
const mapColorHover = "#ff0000";
const mapColorFavorite = "url(#favoriteStateBackgroundImage";


// Global variable: End user's Favorite State
  // localStorage sets this if the user set one in the last session
var myFavoriteState = localStorage.favoriteState;
var myFavoriteStateID = localStorage.favoriteStateID;




// Function to see if there is anything in localStorage, and selects the state
function onLoadState(){
  var onLoadFavoriteStateNode = document.getElementById(myFavoriteStateID);
  onLoadFavoriteStateNode.setAttribute("favorite", "true");
  onLoadFavoriteStateNode.setAttribute("fill", mapColorFavorite);
};


// function to remove any previously selected favorite state.
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



// Global location
var myLat = 0;
var myLong = 0;


// function that updates the myLat and myLong variable with GPS
var getOurLocation = function(){
  
   function _success(pos) {
    myLat = pos.coords.latitude;
    myLong = pos.coords.longitude;
 
  };
  
  function _error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    
  };

  navigator.geolocation.getCurrentPosition(_success,_error);

};  // getOurLocation







/// Global my state variable
var usersHomeState = "America";


// Find our state, based on GPS coords
var getOurState = function(){
  
    var url = "http://nominatim.openstreetmap.org/reverse?pdoran@gmail.com&zoom=8&format=json&lat=" + myLat + "&lon=" + myLong;
  
    req = new XMLHttpRequest();
    req.open('GET', url);
    req.send();
    
    
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      var _returnedAddress =JSON.parse(this.responseText);
       console.log(_returnedAddress.address.state);
      
      usersHomeState = _returnedAddress.address.state;
      
    };
  };
  
  
};








  // Waits for all content to be loaded
  document.addEventListener('DOMContentLoaded', function() {
   
  
   // Selects all the child nodes of SVGMAP
    var mapchild = svgamericamap.children;

    // on Mobile, loop through SVG map and make a dropdown
    
    var stateArray = []
    
      // Dropdown where we want our states added
    var fiftyStatesDropdown = document.getElementById("fiftyStatesDropdown");
    
    var makeMapMobile = function(){
      
      for(var i=0;i < mapchild.length; i++){

        var _stateID = mapchild[i].getAttribute("data-id");
        var _stateName = mapchild[i].getAttribute("data-name");
       var newStateOptionNode = "<option value=" + _stateID + ">" + _stateName + "</option>";
        //var newStateOptionNode = "<option></option>"
        
        stateArray.push(newStateOptionNode);
        
        
      };

      var stateArrayString = stateArray.toString();
      console.log(fiftyStatesDropdown)
      fiftyStatesDropdown.innerHTML = stateArrayString;


    };
    
    makeMapMobile();
    
    console.log(stateArray)
    // Local Storage Getterer
    onLoadState();


    
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