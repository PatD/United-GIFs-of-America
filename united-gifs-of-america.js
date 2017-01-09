// Save to local storage links
var saveButton = document.getElementById("myOfficialStateSaver");


// End user's Favorite State
// localStorage sets this if the user set one in the last session
var myState = localStorage.favoriteState;
console.log("global variable set: " + myState );



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






// function to save selected state to myState variable, and to local storage
function savemyState(passedStateName, passedStateID){
  
    // Adds event listener for clicking save
    saveButton.addEventListener("click", function handler(){
    
      // If we leave this line in, we can only use the button once? 
      this.removeEventListener('click', handler);
      
      // Put our passed value into local storage!
      localStorage.setItem('favoriteState', passedStateName);
      localStorage.setItem('favoriteStateID', passedStateID);
      
      // The state which we just selected to be favorite
      var mySelectedStateID = document.getElementById(passedStateID);
      console.log(mySelectedStateID);
      
      
      // sets favorite state
      mySelectedStateID.setAttribute("fill", "url(#favoriteStateBackgroundImage");
  
   
    });
  
};


// Checks to see if there is anything in localStorage, and acts on it
function onLoadState(){
  
    /*
    myState = localStorage.favoriteState;
    
    console.log("local mystate var: " + myState)
  
  
    return function(){
         myState = localStorage.favoriteState; 
    };
    */

  // find the localstoraged state
  
  // set the url(#favoriteStateBackgroundImage)
  
};





  // Waits for all content to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    
    // Local Storage Getterer
    onLoadState();
    
    // location of SVG map
    const svgamericamap = document.getElementById("SVGAMERICA");
    
    // State name text node
    var stateNameHeader = document.getElementById("stateNameh2");
    
    // Image + text where per-state-gif lands
    var stateGifHolder = document.getElementById("stateGifHolder");
    var stateTitleforModal = document.getElementById("stateTitleforModal");
    
    // Loading GIF for modal
    var loadingGif = "loading-america.gif";
  
    // the states
    var mapchild = svgamericamap.children;
    
    

    // Loop through the states
    for(var i = 0; i < mapchild.length; i++){

    // Mouseover event handler
      mapchild[i].addEventListener("mouseover", function(){
        
          // Sets background color of state
          this.setAttribute("fill","red");
          
          var stateFullName = this.getAttribute("data-name");
          
          // sets text header to state name
          stateNameHeader.textContent = stateFullName;
          
          // Clears already loaded GIF if there is one
          // So it doesn't show up accidentally for fast-clickers
          stateGifHolder.setAttribute("src", loadingGif);

        
      }); // End mouseover function
      
      
      
      
      
      
      
      
    // Mouseout event handler
      mapchild[i].addEventListener("mouseout", function(){
        this.setAttribute("fill","#fff");
        
         var stateFullName = this.getAttribute("data-name");
        
        // removes state name
        stateNameHeader.textContent = " ";
      }); // End mosueout function
      
      
      
      // Event listener for click
       mapchild[i].addEventListener("click", function(){
         
        // What the state and ID are here:
        var stateFullName = this.getAttribute("data-name");
        var stateID = this.getAttribute("data-id");
         
        this.setAttribute("fill","blue");
          
          
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