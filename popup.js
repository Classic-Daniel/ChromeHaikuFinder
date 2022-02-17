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

    var countSyllables = function(word) 
    {
        word = word.toLowerCase();                                     
        word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');   
        word = word.replace(/^y/, '');
        var syl = word.match(/[aeiouy]{1,2}/g);
        // console.log(syl);
        if(syl)
        {
            return syl.length;
        }
        return 0;
    };
    
    bodyText = extractContent(document.body.innerHTML);
    words = bodyText.split(" ");
    var syllableCounts = Array(words.length);
    for (let index = 0; index < words.length; index++) {
        words[index] = words[index].replace(/[^a-z]/gi, '');
        syllableCounts[index] = countSyllables(words[index]);
    }

    // find sequences where the words fit a 5,7,5 syllable sequence
    var haikus = Array(0);
    var lineStructure = [5, 12, 17];
    for (let start = 0; start < words.length; start++) {
        var wordIndex = start;
        var wordCount = 0;
        var syllablesSoFar = 0;
        var lineIndex = 0;
        while(wordIndex < syllableCounts.length)
        {
            syllablesSoFar = syllablesSoFar + syllableCounts[wordIndex];
            if(syllablesSoFar > lineStructure[lineIndex])
            {
                break; // not a fit
            }
            else if(syllablesSoFar === lineStructure[lineIndex])
            {
                lineIndex = lineIndex + 1;
                if(lineIndex === 3)
                {
                    // it's a match!

                    // filter by syllable count
                    if(syllablesSoFar / wordCount < 2.5)
                    {
                        break;
                    }
                    if(words[wordIndex] === "the" || words[wordIndex] === "a" || words[wordIndex] === "an")
                    {
                        break;
                    }
                    
                    haiku = words.slice(start, start + wordCount);
                    haiku = haiku.join(" ");
                    haikus.push(haiku);
                }
            }

            wordIndex = wordIndex + 1;
            wordCount = wordCount + 1;
        }
    }

    console.log(haikus);
  }

