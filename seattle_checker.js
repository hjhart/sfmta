var page = new WebPage(), testindex = 0, loadInProgress = false;

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onLoadStarted = function() {
  loadInProgress = true;
  console.log("load started");
};

page.onLoadFinished = function() {
  loadInProgress = false;
  console.log("load finished");
};



var steps = [
  function() {
    //Load Login Page
    page.open("http://web1.seattle.gov/courts/scofflaw/Default.aspx");
  },
  function() {
    //Enter Credentials


		page.evaluate(function() {
			var licensePlate = 'asd123'
			$("#ctl00_ContentPlaceHolder1_rtbVehPlate_text").val(licensePlate)
			console.log("License plate value filled in: " + $("#ctl00_ContentPlaceHolder1_rtbVehPlate_text").val());
			$("#ctl00_ContentPlaceHolder1_rcbState_Input").val("WASHINGTON")
			console.log("State plate value filled in: " + $("#ctl00_ContentPlaceHolder1_rcbState_Input").val());
			console.log("The button requested: " + $("#ctl00_ContentPlaceHolder1_btnSrchByVehPlate").length)
			$("#ctl00_ContentPlaceHolder1_btnSrchByVehPlate").click()
			$("#ctl00_ContentPlaceHolder1_btnSrchByVehPlate").trigger('click')
		});

		loadInProgress = true;
		var count = 0;
		var fint = setInterval(function() {
		   var resultsPanel = document.getElementById('ctl00_ContentPlaceHolder1_gridPanel')
           count++;
		   console.log("Waiting for ajax " + count + " and found " + resultsPanel);
           if (resultsPanel !== null) {
               clearInterval(fint);
               loadInProgress = false;
           }
           if (count > 15) {
               clearInterval(fint);
               loadInProgress = false;
           }
       }, 1000);
  },
  function() {
		page.evaluate(function() {
			console.log("Test complete!");
			console.log($('#ctl00_ContentPlaceHolder1_lblParkingCounts').html());
			console.log($('#ctl00_ContentPlaceHolder1_lblInfrations').html());
			console.log($('#ctl00_ContentPlaceHolder1_lblTrafficCamera').html());
		});
  },
  function() {
    // Output content of page to stdout after form has been submitted
    page.evaluate(function() {
      console.log(document.querySelectorAll('html')[0].outerHTML);
    });
  }
];


var testIndex = 0;
interval = setInterval(function() {
    if (!loadInProgress && typeof steps[testIndex] == "function") {
        console.log("step " + (testIndex + 1));
        steps[testIndex]();
        testIndex++;
    }
    if (typeof steps[testIndex] != "function") {
        console.log("test complete!");
        clearInterval(interval);
        phantom.exit();
    }
}, 500);