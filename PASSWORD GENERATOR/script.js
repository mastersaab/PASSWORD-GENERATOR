const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'; //symbol ki string leliya 53 54 line me us ehogi
//PHLE SE JO H WO LIKH DE
let password ="";
let passwordLength =10;
let checkCount=1;
handleSlider(); //call kr diya 
// strength circle colour to grey 
setIndicator("#ccc");

//set password length
function handleSlider(){
    inputSlider.value=passwordLength; //starting me 10 tha esliye
    lengthDisplay.innerText =passwordLength; //inner text 10 h
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}
//set indicator wala function

function setIndicator(color){
    indicator.style.backgroundColor = color;       //color set krnka h
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;     // shdow krneka h

}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; //math.random function 0 se 1 tkk no degi
}

function generateRandomNumber() {
    return getRndInteger(0,9);  //yha pe getrnd 0 se 9 tkk no dega esliye eske upper wala code kiya gya tha 
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length); //random grnerate kr liya
    return symbols.charAt(randNum);
}
// rule to have strong and weak password
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    //phle false mark kr liya fir jb check hoga wo to true mark kr do
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    //rules......................

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
  }

  async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);  //clipbord pe copy krn h to
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {  //used ki kitne samye ke liye visival hona h ki nhi
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) { //suffal hoga esse
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition password 1 kiye h or tick 4ro kiye h to khud 4 me convert ho jayega 
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);   //
})


inputSlider.addEventListener('input', (e) => {      //slider scroll krne pe number bhi uske anusar change hoga 
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {         // ager koi value bada h to copy hoga nhi to ni ho payega
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {    // ye samjh na h dubara
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition jitna tick kiya gya h wo 
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition baki ka 
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password ki kon sa kha pe rhega
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength i kitna strong h password
    calcStrength();
});



 

 
