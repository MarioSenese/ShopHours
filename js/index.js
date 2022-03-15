const shops = document.querySelectorAll("#hours .shops .h");
const mondayFriday = shops[0];
const saturday = shops[1];

let hourSelected, minuteSelected;

/**
 *  Morning days
*/

    let morningMondayFriday_from = mondayFriday.querySelector(".morning .from");
    let morningMondayFriday_to = mondayFriday.querySelector(".morning .to");
    let morningSaturaday_from = saturday.querySelector(".morning .from");
    let morningSaturaday_to = saturday.querySelector(".morning .to");
    
/**
 *  Afternoon days
*/

    let afternoonMondayFriday_from = mondayFriday.querySelector(".afternoon .from");
    let afternoonMondayFriday_to = mondayFriday.querySelector(".afternoon .to");
   
/**
 *  Create an element for list working hours
*/
    
    const workingHours = document.createElement("div"); // create element
    workingHours.className = "working hours"; // class definition
    
/**
 *  "mouseup" event definition to manage the closure of the working hours list
*/

    document.addEventListener("mouseup", (e) => {
        
        let workingHours = document.querySelector("#hours .shops .working.hours");
        let itemClicked =   (
                                workingHours != null // if working hours list exists then..
                            ) ? (
                                workingHours.children[0].childNodes[0].localName === e.target.localName // return true if click is on item
                            ) : (
                                false // else
                            );
                    
        if( ( document.querySelector("#hours .shops").querySelector("input").classList[0] !== e.target.classList[0] ) &&
                ( workingHours != null ) &&
                (!itemClicked) ) {
                    
                    workingHours.remove(); // remove working hours list if i click anywhere in the document except on tags: input text, ul and li
        } 
        
        
    });
    
/**
 *  "onclick" event definition to manage the click on each input text
*/

    morningMondayFriday_from.querySelector("input").onclick = 
            morningMondayFriday_to.querySelector("input").onclick = 
            morningSaturaday_from.querySelector("input").onclick = 
            morningSaturaday_to.querySelector("input").onclick = 
            afternoonMondayFriday_from.querySelector("input").onclick = 
            afternoonMondayFriday_to.querySelector("input").onclick = (e) => {
        
                e.target.parentNode.insertBefore(workingHours, e.target.nextSibling); // add "workingHours" element like input's minor sibling
                selectWorkingHours();
        
    };
    

/**
 *  "selectWorkingHours" function definition
*/

    const selectWorkingHours = () => {
        
        let arrayHours = Array.from( Array(24), (_, i) => ( i <= 9 ) ? ( "<li>0" + i + "</li>" ) : ( "<li>" + i + "</li>" ) ); // create list hours
        let arrayMinutes = Array.from( Array(60), (_, i) => ( i <= 9 ) ? ( "<li>0" + i + "</li>" ) : ( "<li>" + i + "</li>" ) ); // create list minutes
        
        workingHours.innerHTML = "<ul class='hour'>" + arrayHours.join("") + "</ul><ul class='minute'>" + arrayMinutes.join("") + "</ul>"; // body definition for "workingHours" element
        
        let input = workingHours.previousSibling; // get input like "workingHours" element's major sibling
        const regex = /(\d{1,2})[:](\d{1,2})/;
        let matches = input.value.match(regex);
        
        hourSelected = matches[1];
        minuteSelected = matches[2];
        
        select(input, regex); // call a "select" subfunction
        
    };
    
/**
 *  "select" subfunction definition
*/

    const select = (input, regex) => {
        
        let liHourSelected = workingHours.getElementsByClassName("hour")[0].querySelectorAll("li")[parseInt(hourSelected)]; // get hour item selected
        let liMinuteSelected = workingHours.getElementsByClassName("minute")[0].querySelectorAll("li")[parseInt(minuteSelected)]; // get minute item selected
        
        /*
         *  Set "selected" attribute for items selected
        */
            
            liHourSelected.setAttribute("selected", "");
            liMinuteSelected.setAttribute("selected", "");
            
        let inputParent = input.parentNode;
        let inputClass = inputParent.classList[0];
        let inputValue = inputParent.querySelector("input").value.match(regex)[1];
        
        disableItems(inputParent, inputClass, regex, input.parentNode.parentNode.classList[0].toLowerCase());
        
        workingHours.getElementsByClassName("hour")[0].scrollTop = liHourSelected.offsetTop; // Position on hour value selected
        workingHours.getElementsByClassName("hour")[0].querySelectorAll("li").forEach( (li) => { 
            
            li.onclick = (e) => {
                
                if(!e.target.hasAttribute("disabled")) {
                    
                    e.target.parentNode.querySelectorAll("li[selected]").forEach( (sel) => sel.removeAttribute("selected") ); // Remove all "selected" attribute from other items, in the hour list
                    e.target.setAttribute("selected", ""); // Set "selected" attribute for new hour item clicked
                    hourSelected = e.target.innerText;
                    input.setAttribute("value", hourSelected + ":" + minuteSelected);
                    
                }
                
            };
            
        });
        
        workingHours.getElementsByClassName("minute")[0].scrollTop = liMinuteSelected.offsetTop; // Position on minute value selected
        workingHours.getElementsByClassName("minute")[0].querySelectorAll("li").forEach( (li) => {
            
            li.onclick = (e) => {
                
                if(!e.target.hasAttribute("disabled")) {
                    
                    e.target.parentNode.querySelectorAll("li[selected]").forEach( (sel) => sel.removeAttribute("selected") ); // Remove all "selected" attribute from other items, in the minute list
                    e.target.setAttribute("selected", ""); // Set "selected" attribute for new minute item clicked
                    minuteSelected = e.target.innerText;
                    input.setAttribute("value", hourSelected + ":" + minuteSelected);
                    
                }
                
            }
            
        });
        
    };
    
/**
 *  "disableItems" function definition
*/

    const disableItems = (inputParent, inputClass, regex, time) => {
        
        let inputSibling, inputSiblingValue, items;
        
        switch (inputClass) {
            
            case "from":
                
                inputSibling = inputParent.nextElementSibling; // get minor sibling
                break;
            
            case "to": 
                
                inputSibling = inputParent.previousElementSibling; // get major sibling
                break;
            
            default: 
                break;
            
        }
        
        inputSiblingValue = inputSibling.querySelector("input").value.match(regex)[1]; // get sibling input value
        items = workingHours.getElementsByClassName("hour")[0].querySelectorAll("li");
        
        /**
         *  Block or disable items 
         *      1. minor sibling if hour selected value is lower to sibling input value, from the value of the latter to rise
         *      2. major sibling if hour selected value is higher to subling input value, from the value of he latter to the discent
        */
            
            let block = ( parseInt(hourSelected) < parseInt(inputSiblingValue) ) ? ( minorSiblings(items[parseInt(inputSiblingValue-1)]) )  : ( majorSiblings(items[parseInt(inputSiblingValue)+1]) );
            block.forEach( (li) => li.setAttribute("disabled", "") );
            
            
        /**
         *  For only days from Monday to Friday.
         *  Block or disable items
         *      1. minor sibling if hour selected value is lower to parent's sibling input value, from the value of the latter to rise
         *      2.
        */
            
            if(inputParent.parentNode.parentNode.classList.value.split(" ")[1].toLowerCase() == "monday" && inputParent.parentNode.parentNode.classList.value.split(" ")[2].toLowerCase() == "friday" ) {
                
                let inputValue;
                
                switch(time.toLowerCase()) {
                    
                    case "morning": 
                        
                        const afternoonInput_from = inputParent.parentNode.parentNode.querySelector(".afternoon .from input"); 
                        inputValue = afternoonInput_from.value.match(regex)[1];
                        break;

                    case "afternoon": 
                        
                        const morningInput_to = inputParent.parentNode.parentNode.querySelector(".morning .to input");
                        inputValue = morningInput_to.value.match(regex)[1];
                        break;
                    
                    default:
                        break;
                    
                }
                
                items = workingHours.getElementsByClassName("hour")[0].querySelectorAll("li");
                block = ( parseInt(hourSelected) < parseInt(inputValue) ) ? ( minorSiblings(items[parseInt(inputValue)-1]) ) : ( majorSiblings(items[parseInt(inputValue)+1]) );
                block.forEach( (li) => li.setAttribute("disabled", "") );
                
            }
    
        
    };
    
/**
 *  "majorSiblings" function definition
*/
    
    const majorSiblings = (li) => {
        
        let arr = [];
        
        while( li = li.previousElementSibling ) {
            arr.push(li);
        }
        
        return arr;
        
    };


/**
 *  "minorSiblings" function definition
*/
    
    const minorSiblings = (li) => {
        
        let arr = [];
        
        while( li = li.nextElementSibling ) {
            arr.push(li);
        }
        
        return arr;
        
    }