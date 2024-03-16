const inputSilder = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passWordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector("[generateButton]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+{}:;"<,>?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength color to grey
setIndicator("#ccc");
// set password length
function handleSlider() {
    inputSilder.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSilder.min;
    const max = inputSilder.max;
    inputSilder.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow=`0px 0px 12px 3px ${color}`;
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
    return getRndInteger(0, 9);
}
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
    const random = getRndInteger(0, symbols.length);
    return symbols.charAt(random);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

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
        await navigator.clipboard.writeText(passWordDisplay.value);

        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }
    // to maske copied span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // Fisher yates algorithmm 
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));;
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    });
    if(checkCount>passwordLength){
        passwordLength=checkCount;
        handleSlider();
    }
}

 allCheckBox.forEach((checkBox)=>{
    checkBox.addEventListener('change', handleCheckBoxChange);
 })
inputSilder.addEventListener('input', (e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', ()=>{
    if(passWordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', ()=>{
       //none of the checkbox are selected
       if(checkCount<=0){
        return ;
       }
       if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
       }
    //    let's start!!
    //remove old password
    password="";
  
    // let's put the stuff mentioned by the checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();

    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();

    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols();
    // }
       let funcArr=[];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);

    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);

    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    // compulsory addition:
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    // remaining addtion;
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
    }
    
    // shuffle password
    password=shufflePassword(Array.from(password));
    
    // display password
    passWordDisplay.value=password;
    // calculate strength
    calcStrength();
})
 