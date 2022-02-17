// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: findHaikus,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }

function findHaikus() {
    var extractContent = function (s, space) {
        var span= document.createElement('span');
        span.innerHTML= s;
        if(space) {
          var children= span.querySelectorAll('*');
          for(var i = 0 ; i < children.length ; i++) {
            if(children[i].textContent)
              children[i].textContent+= ' ';
            else
              children[i].innerText+= ' ';
          }
        }
        return [span.textContent || span.innerText].toString().replace(/ +/g,' ');
      };
    
    // Initialize butotn with users's prefered color
    let changeColor = document.getElementById("changeColor");
    
    chrome.storage.sync.get("color", ({ color }) => {
      changeColor.style.backgroundColor = color;
    });


    console.log(extractContent(document.body.innerHTML));
    // console.log(extractContent("<p>Hello</p><a href='http://w3c.org'>W3C</a>.  Nice to <em>see</em><strong><em>you!</em></strong>"));
    console.log("Ran");
  }

