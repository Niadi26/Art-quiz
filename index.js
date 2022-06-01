
const artistQuizButton = document.querySelector('.artist_quiz');
const picturesQuizButton = document.querySelector('.pictures_quiz');
const headerBlock = document.querySelector('.header_main'); 
const mainBlock = document.querySelector('.main');
const artistBlock = document.querySelector('.artist_category');
const picturesBlock = document.querySelector('.pictures_category');
const footerBlock = document.querySelector('.footer');

const navHeader = document.createElement('div');
navHeader.classList.add('navigation_header');
navHeader.innerHTML = `<a id='home_logo' class='header_logo' href='#'></a><nav class='navigation'><ul class='navigation_container'>
                        <li class=''><a href='#' id='home' class='navigation_item'>Главная</a> </li>
                        <li class=''><a href='#' id='categories' class='navigation_item active_nav'>Категории</a></li>
                        <li class=''><a href='#' id='score' class='navigation_item active_nav hide'>Score</a></li></ul></nav>`

if (!localStorage.getItem('volumeQuiz')) localStorage.setItem('volumeQuiz', '0');
if (!localStorage.getItem('timerQuiz')) localStorage.setItem('timerQuiz', '0');
if (!localStorage.getItem('scoreQuiz')) localStorage.setItem('scoreQuiz', JSON.stringify(new Object));

//get score if it is
function getScore() {
    const prevScore = JSON.parse(localStorage.getItem('scoreQuiz'));
    const arrScore = Object.entries(prevScore);
    arrScore.forEach(el => {
        const result = countScore(el[1]);
        makeScoreResult(el[0], result);
    })
}
getScore();

  //quiz js
let getInfo = async function() {
    let result = await fetch('./data/data.json');
    let arr = await result.json();
    return arr;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

const body = document.querySelector('body');
const wrapper = document.querySelector('.wrapper');
const ALL_QUESTIONS = 240;
const HALF_QUESTIONS = 120;
let counter;
let firstNum;
let randomNum;
const imgArr = makeImgArr('https://raw.githubusercontent.com/Niadi26/image-data/master/full/', 'full.jpg');
const infoImgArr = makeImgArr('https://raw.githubusercontent.com/Niadi26/image-data/master/img/', '.jpg');
const trueAnswers = [];

function makeImgArr(url, end) {
    let arr = [];
    for(i=0; i < ALL_QUESTIONS; i++) {
        arr.push(`${url}${i}${end}`)
    }
    return arr
}

body.addEventListener('click', (e) => {
    if (e.target.className === 'category_img' || e.target.className === 'category_img img_black') {
        firstNum = +e.target.id;
        counter = +e.target.id;
        let ind = +e.target.id;
        getInfo().then((arr) => {
            if(ind < HALF_QUESTIONS) {
            makePossibleAnswers(ind, arr);
            } else {
                makePossiblePictures(ind, arr);
            }
        })
    artistBlock.classList.add('hide');
    picturesBlock.classList.add('hide');
    }
})

function getRandomNum (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makePossibleAnswers(ind, arr) {
    const set = new Set();
    const autorArray = [];
    let imgSrc = imgArr[ind];
    set.add([arr[ind].author, true]);
    while(set.size < 4) {
        randomNum = getRandomNum(0, ALL_QUESTIONS - 1);
       if(!(arr[ind].author === arr[randomNum].author)) {
            set.add(arr[randomNum].author);
       }
    }
    set.forEach((el) => autorArray.push(el));
    shuffle(autorArray);
    createAnswers(autorArray, imgSrc);
}

function makePossiblePictures (ind, arr) {
    const picturesArray = [];
    let autor = arr[ind].author;
    picturesArray.push([imgArr[ind], true]);
    while(picturesArray.length < 4) {
        randomNum = getRandomNum(0, ALL_QUESTIONS - 1);
        if(!(arr[ind].author === arr[randomNum].author)) {
            picturesArray.push(imgArr[randomNum]);
        }
    }
    shuffle(picturesArray);
    createPictures(picturesArray, autor);
}

let divQwestion;

let setTimeIndex;
function showTime(timer, num) {
    timer.innerHTML = num;
    if (num === 0) {
        createInfo(counter, false);
    } else {
        setTimeIndex = setTimeout(() => showTime(timer, num - 1), 1000);
    }
}

function createQwestion(newAns, imgSrc) {
    divQwestion = document.createElement('div');
    let newQw = document.createElement('div');
    let newImg = document.createElement('div');
    let exitButton = document.createElement('button')

    divQwestion.className = 'qwestion';
    exitButton.className = 'qwestion_exit'
    newQw.className = 'qwestion_el qwestion_txt';
    newImg.className = 'qwestion_el qwestion_img';
    newAns.className = 'qwestion_el answer_container';

    const isTimer = localStorage.getItem('timerQuiz');
    if (isTimer != 0) {
        const timer = document.createElement('div');
        divQwestion.prepend(timer);
        showTime(timer, isTimer);
    }

    newQw.innerHTML = 'Кто автор этой картины?'
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {  
        newImg.style.backgroundImage = `url('${img.src}')`;
    }

    divQwestion.append(exitButton);
    divQwestion.append(newQw);
    divQwestion.append(newImg)
    divQwestion.append(newAns);
    wrapper.append(divQwestion);     
    mainBlock.classList.remove('hide');                         
}

function createAnswers(arr, imgSrc) {
    let inner = document.createElement('div');
    arr.forEach((el) => {
        const butt = document.createElement('button');
        butt.className = 'answer_el';                        
        if(Array.isArray(el)){
            butt.textContent = el[0];
            butt.id = el[1];
        } else {
            butt.textContent = el;
        }
        inner.append(butt);
        })
    createQwestion(inner, imgSrc);
} 

function createPictures(arr, autor) {
    let inner = document.createElement('div');
    arr.forEach((el, index) => {
        const butt = document.createElement('button');
        butt.className = 'pictures_el';                        
        if(Array.isArray(el)){
            const img = new Image();
            img.src = arr[index][0];
            img.onload = () => {  
            butt.style.backgroundImage = `url('${img.src}')`;
            }
            butt.id = arr[index][1];
        } else {
            const img = new Image();
            img.src = arr[index];
            img.onload = () => {  
            butt.style.backgroundImage = `url('${img.src}')`;
            }
        }
        inner.append(butt);
    })
    createPictureQwestion(inner, autor);
} 

function createPictureQwestion(newAns, autor) {
    divQwestion = document.createElement('div');
    let newQw = document.createElement('div');
    let exitButton = document.createElement('p')

    divQwestion.className = 'qwestion';
    exitButton.className = 'qwestion_exit'
    newQw.className = 'qwestion_el qwestion_txt';
    newAns.className = 'qwestion_el pictures_container';  

    const isTimer = localStorage.getItem('timerQuiz');
    if (isTimer != 0) {
        const timer = document.createElement('div');
        divQwestion.prepend(timer);
        showTime(timer, isTimer);
    }

    newQw.innerHTML = `Какую картину написал ${autor}?`

    divQwestion.append(exitButton);
    divQwestion.append(newQw);
    divQwestion.append(newAns);
    wrapper.append(divQwestion);
    mainBlock.classList.remove('hide');                                 
}

body.addEventListener('click', (e) => {
    if (e.target.className === 'answer_el') {
        clearTimeout(setTimeIndex);
        const buttons = document.querySelectorAll('.answer_el');
        buttons.forEach((el) => el.style.pointerEvents = 'none');
        if (e.target.id === 'true') {
            e.target.className = 'answer_el right'
            createInfo(counter, true);
        } else {
            e.target.className = 'answer_el wrong'
            createInfo(counter, false);
        }
    } else if (e.target.className === 'pictures_el') {
        clearTimeout(setTimeIndex);
        const buttons = document.querySelectorAll('.pictures_el');
        buttons.forEach((el) => el.style.pointerEvents = 'none');
        let owerlay = document.createElement('div');
        let key = 'picture';
        if (e.target.id === 'true') {
            owerlay.className = 'right_pic';
            e.target.prepend(owerlay);
            createInfo(counter, true, key);
        } else {
            owerlay.className = 'wrong_pic';
            e.target.prepend(owerlay);
            createInfo(counter, false, key);
        }
    }
})

let divInfo;

function createInfo(index, result, key) {
    divInfo = document.createElement('div');
    divInfo.className = 'info_cont';
    getInfo().then((arr) => {

        let trueInfo = document.createElement('div');
        let imgInfo = document.createElement('div');
        let nameInfo = document.createElement('div');
        let autorInfo = document.createElement('div');
        let nextInfo = document.createElement('button');
        if(result) {
            trueInfo.className = 'info_result true_index';
            trueAnswers.push([infoImgArr[index], 'true']);
            makeSound('true');                 
        } else {
            trueInfo.className = 'info_result false_index';
            trueAnswers.push([infoImgArr[index], 'false']);  
            makeSound();                       
        }
        imgInfo.className = 'info_img';
        nameInfo.className = 'info_name';
        autorInfo.className = 'info_autor';
        nextInfo.className = 'info_button';
        if (key) {
            nextInfo.id = 'picture';
        }

        const img = new Image();
        img.src = infoImgArr[index];
        img.onload = () => {  
            imgInfo.style.backgroundImage = `url('${img.src}')`;
        };
        nameInfo.innerHTML = arr[index].name;
        autorInfo.innerHTML = `${arr[index].author}, ${arr[index].year}`;
        nextInfo.innerHTML = 'Следующий вопрос';

        divInfo.append(trueInfo);
        divInfo.append(imgInfo);
        divInfo.append(nameInfo);
        divInfo.append(autorInfo);
        divInfo.append(nextInfo);
        divQwestion.append(divInfo);
    });
}

body.addEventListener('click', (e) => {
    if (e.target.className === 'info_button') {
        if(counter == +firstNum + 9) {
            divInfo.remove();
            showScore()                                              
        } else {
        divQwestion.remove();
        ++counter;
        let ind = counter;
        getInfo().then((arr) => {
            if (e.target.id) {
                makePossiblePictures(ind, arr);  
            } else {
                makePossibleAnswers(ind, arr);  
            }    
        })
        }
    }
})

function showScore() {
    const result = countScore(trueAnswers);
    let prevScore = JSON.parse(localStorage.getItem('scoreQuiz'));
    prevScore[firstNum] = trueAnswers;
    localStorage.setItem('scoreQuiz', JSON.stringify(prevScore));
    createResult(result);
}

function countScore(arr) {
    let trueCount = 0;
    arr.forEach((el)=> {
        if(el[1] === 'true') {
            trueCount += 1;
        }
    });
    return trueCount;
}

function createResult(index) {
    let blockResult = document.createElement('div');
    let textResult = document.createElement('div');
    let scoreResult = document.createElement('div');
    let buttonResult = document.createElement('button');

    blockResult.className = 'info_cont';
    textResult.className = 'result_txt';
    scoreResult.className = 'result_score';
    buttonResult.className = 'result_button';
    buttonResult.id = `${index}`

    if (index < 1) {
        textResult.innerHTML = 'Не беда, будет лучше!';
        scoreResult.innerHTML = `0/10`;

    } else if (index === 10) {
        textResult.innerHTML = 'Отличный результат!'
        scoreResult.innerHTML = `10/10`;

    } else {
        textResult.innerHTML = 'Поздравляю!';
        scoreResult.innerHTML = `${index}/10`;
    }
    buttonResult.innerHTML = 'Выйти'

    blockResult.append(textResult);
    blockResult.append(scoreResult);
    blockResult.append(buttonResult);

    divQwestion.append(blockResult);
}

let blockExit;
body.addEventListener('click', (e) => {
    if (e.target.className === 'qwestion_exit') {
        blockExit = document.createElement('div');
        let textExit = document.createElement('div');
        let buttonExitYes = document.createElement('button');
        let buttonExitNo = document.createElement('button');

        blockExit.className = 'qwestion_block';
        textExit.className = 'qwestion_exit_txt'
        buttonExitYes.className = 'qwestion_exit_block';
        buttonExitYes.id = 'qwestion_yes'
        buttonExitNo.className = 'qwestion_exit_block';
        buttonExitNo.id = 'qwestion_no'

        textExit.innerHTML = 'Хотите покинуть игру?'
        buttonExitYes.innerHTML = 'Да'
        buttonExitNo.innerHTML = 'Нет'

        blockExit.append(textExit);
        blockExit.append(buttonExitYes);
        blockExit.append(buttonExitNo);

        divQwestion.append(blockExit);
    }
})

//exit of the game
function exitFromGame() {
    divQwestion.remove();
    headerBlock.classList.remove('header_category');
    navHeader.remove();                                   
    footerBlock.classList.remove('footer_black');
    trueAnswers.length = 0;                          
}

body.addEventListener('click', (e) => {
    if (e.target.className === 'result_button') {
        const result = e.target.id;
        makeScoreResult(firstNum, result);
        exitFromGame();                              
    }
})

body.addEventListener('click', (e) => {
    if (e.target.className === 'qwestion_exit_block') {
        if (e.target.id === 'qwestion_yes') {
            exitFromGame();
            clearTimeout(setTimeIndex);
        } else if (e.target.id === 'qwestion_no') {
            blockExit.remove();
        }
    }
})

//score
let scoreBlock;

function createScore (array, num) {
    let idNum = num;
    scoreBlock = document.createElement('div');
    scoreBlock.className = 'score_container';
    array.forEach((el, index, arr) => {
        let item = document.createElement('div');
        const img = new Image();
        img.src = arr[index][0];
        img.onload = () => {  
            item.style.backgroundImage = `url('${img.src}')`;
        }
        item.className = 'score_el';
        item.dataset.id = idNum;
        if (arr[index][1] === 'false') {
            item.className = 'score_el img_black';
        }
        scoreBlock.append(item);
        idNum++;
    })
    wrapper.append(scoreBlock);
}

//make circles score
function makeScoreResult(num, result) {
    let changeCategory = document.getElementById(`${num}`);
    let actualScore = changeCategory.getElementsByTagName("button")[0];
    actualScore.innerHTML = `${result}/10`;
    actualScore.classList.remove('hide')
    changeCategory.classList.remove('img_black'); 
}

//open score container
body.addEventListener('click', (e) => {
    if (e.target.className === 'category_score') {
        let num = e.target.dataset.num;
        const scoreObj = JSON.parse(localStorage.getItem(`scoreQuiz`));
        createScore(scoreObj[num], num);
    }
})

//show wright answers in container
body.addEventListener('click', (e) => {
    if (e.target.className === 'score_el' || e.target.className === 'score_el img_black') {
        let num = e.target.dataset.id;
        let infoScore = document.createElement('div');
        let infoScoreName = document.createElement('p');
        let infoScoreAutor = document.createElement('p');
        let infoScoreData = document.createElement('p');
        infoScore.className = 'info_score';
        infoScoreName.className = 'txt_score';
        infoScoreAutor.className = 'txt_score';
        infoScoreData.className = 'txt_score';
        getInfo().then((arr) => {
            infoScoreName.innerHTML = arr[num].name;
            infoScoreAutor.innerHTML = arr[num].author;
            infoScoreData.innerHTML = arr[num].year;
        })
        infoScore.append(infoScoreName);
        infoScore.append(infoScoreAutor);
        infoScore.append(infoScoreData);
        e.target.append(infoScore);
    }
})

// navigation
function showCategory() {
    headerBlock.classList.add('header_category');
    headerBlock.prepend(navHeader);
    mainBlock.classList.add('hide');
    footerBlock.classList.add('footer_black');
}

artistQuizButton.addEventListener('click', ()=> {
    showCategory();
    artistBlock.classList.remove('hide');
});

picturesQuizButton.addEventListener('click', ()=> {
    showCategory();
    picturesBlock.classList.remove('hide');
});

headerBlock.addEventListener('click', (e) => {
    if(e.target.id === 'home_logo' || e.target.id === 'home') {
        headerBlock.classList.remove('header_category');
        navHeader.remove();
        artistBlock.classList.add('hide');
        picturesBlock.classList.add('hide');
        mainBlock.classList.remove('hide');
        footerBlock.classList.remove('footer_black');
        if (scoreBlock) scoreBlock.remove();
    } else if (e.target.id === 'categories') {
        if (scoreBlock) scoreBlock.remove();
    }
})

//settings

const settingsBlock = document.querySelector('.settings');
const settingsButtonOn = document.querySelector('.in_settings');
const settingsButtonOff = document.querySelector('.arrow');
const settingsButtonOff1 = document.querySelector('.cross');
const settingsButtonSave = document.querySelector('.save');
const settingsButtonDefault = document.querySelector('.default');
const sound = document.getElementById('sound');
const timer = document.getElementById('timer');
sound.value = +localStorage.getItem('volumeQuiz') * 100;
timer.value = +localStorage.getItem('timerQuiz');

function addClass() {
    settingsBlock.classList.toggle('settings_on');
}

settingsButtonOn.addEventListener('click', addClass);
settingsButtonOff.addEventListener('click', addClass);
settingsButtonOff1.addEventListener('click', addClass);

settingsButtonSave.addEventListener('click', () => {
    localStorage.setItem('volumeQuiz', `${sound.value / 100}`);
    localStorage.setItem('timerQuiz', `${timer.value}`);
    addClass();
});

settingsButtonDefault.addEventListener('click', () => {
    sound.value = 0;
    localStorage.setItem('volumeQuiz', `0`);
    timer.value = 0;
    localStorage.setItem('timerQuiz', `0`);
    addClass();
});

function makeSound(type) {
    const sound = new Audio();
    (type) ? sound.src = './data/correct-answer-sound-3.mp3' : sound.src = './data/incorrect-25.mp3';
    sound.volume = +localStorage.getItem('volumeQuiz');
    sound.play();
}
