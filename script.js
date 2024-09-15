const liftInput = document.getElementById('lifts');
const floorInput = document.getElementById('floors');
const startBtn = document.getElementById('btn');
const liftFloorSection = document.getElementById("lift-floor-UI");

let liftState = [];
let requestQueue = [];


function isPositiveInteger(value) {
    const number = parseInt(value, 10);
    return Number.isInteger(number) && number > 0;
}


function validateForms() {
    const lifts = liftInput.value;
    const floors = floorInput.value;

    
    if (lifts === "" || floors === "") {
        alert("Please fill in all required values.");
        return false;
    }

    if (isNaN(lifts) || isNaN(floors)) {
        alert("Please enter numeric values for both lifts and floors.");
        return false;
    }

   
    if (!isPositiveInteger(lifts) || !isPositiveInteger(floors)) {
        alert("Please enter positive integers for both lifts and floors.");
        return false;
    }

    return true;
}

function createButton(value, index, floors) {
    const btn = document.createElement('input');
    btn.setAttribute('type', "button");

    if (value === 'Up') {
        btn.setAttribute('value', '▲');
    } else if (value === 'Down') {
        btn.setAttribute('value', '▼');
    }

    btn.id = `${value.toLowerCase()}${index}`;

    if (index === floors - 1 && value === "Up" && floors > 1) {
        btn.style.visibility = "hidden";
    }
    if (index === 0 && value === "Down") {
        btn.style.visibility = "hidden";
    }
    return btn;
}

function createLiftDoors(door, index) {
    const liftDoor = document.createElement('div');
    liftDoor.id = `lift-door-${door} lift-door-${door}-${index}`;
    liftDoor.className = `lift-door-${door}`;
    return liftDoor;
}

function initializeLifts(lifts) {
    liftState = new Array(lifts).fill(null).map(() => ({ currentFloor: 0, inUse: false, isMoving: false }));
    console.log('Lifts initialized:', liftState);
}

function openLiftDoors(lift) {
    return new Promise((resolve) => {
        const doorOne = lift.querySelector('.lift-door-one');
        const doorTwo = lift.querySelector('.lift-door-two');

        doorOne.style.marginRight = '80%';
        doorOne.style.transition = 'all 2.5s ease .5s';
        doorTwo.style.transition = 'all 2.5s ease .5s';

        setTimeout(() => resolve(), 2500);
    });
}

function closeLiftDoors(lift) {
    return new Promise((resolve) => {
        const doorOne = lift.querySelector('.lift-door-one');
        const doorTwo = lift.querySelector('.lift-door-two');

        doorOne.style.marginRight = '';
        doorOne.style.transition = 'all 2.5s ease .5s';
        doorTwo.style.transition = 'all 2.5s ease .5s';

        setTimeout(() => resolve(), 2500);
    });
}

function processQueue() {
    if (requestQueue.length === 0) return;

    const { lifts, direction, floorIndex } = requestQueue.shift();
    console.log(`Processing queue: ${direction} to floor ${floorIndex}`);
    handleLiftsMove(lifts, direction, floorIndex);
}

function toggleFloorButton(buttonId, disable) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = disable;
    }
}

function handleLiftsMove(lifts, direction, floorIndex) {
    const allLifts = document.querySelectorAll('.lift');
    let closestLift = null;
    let minimumDistance = Infinity;

    toggleFloorButton(`${direction}${floorIndex}`, true);

    for (let i = 0; i < allLifts.length; i++) {
        const lift = allLifts[i];
        let currentFloor = parseInt(lift.dataset.currentFloor, 10);
        let distance = Math.abs(currentFloor - floorIndex);

        if (!liftState[i].inUse && !liftState[i].isMoving && distance < minimumDistance) {
            closestLift = lift;
            minimumDistance = distance;
        }
    }

    if (closestLift) {
        const liftIndex = Array.prototype.indexOf.call(allLifts, closestLift);
        liftState[liftIndex].inUse = true;
        liftState[liftIndex].isMoving = true;

        const floorHeight = document.querySelector('.floor-item').offsetHeight;
        const travelTime = minimumDistance * 2;

        if (parseInt(closestLift.dataset.currentFloor, 10) === floorIndex) {
            openAndCloseLiftDoors(closestLift, floorIndex);
        } else {
            closestLift.style.transition = `transform ${travelTime}s linear`;
            closestLift.style.transform = `translateY(-${floorIndex * floorHeight}px)`;

            setTimeout(function () {
                closestLift.dataset.currentFloor = floorIndex;
                openAndCloseLiftDoors(closestLift, floorIndex);
            }, travelTime * 1000);
        }
    } else {
        requestQueue.push({ lifts, direction, floorIndex });
    }
}

function openAndCloseLiftDoors(lift, floorIndex) {
    const liftIndex = Array.prototype.indexOf.call(document.querySelectorAll('.lift'), lift);

    openLiftDoors(lift).then(function () {
        closeLiftDoors(lift).then(function () {
            liftState[liftIndex].inUse = false;
            liftState[liftIndex].isMoving = false;

            toggleFloorButton(`up${floorIndex}`, false);
            toggleFloorButton(`down${floorIndex}`, false);

            processQueue();
        });
    });
}

function handleLiftBtns(floors, lifts) {
    for (let i = floors - 1; i >= 0; i--) {
        document.getElementById(`up${i}`).addEventListener('click', function () {
            requestQueue.push({ lifts, direction: 'up', floorIndex: i });
            processQueue();
        });
        if (i !== 0) {
            document.getElementById(`down${i}`).addEventListener('click', function () {
                requestQueue.push({ lifts, direction: 'down', floorIndex: i });
                processQueue();
            });
        }
    }
}

function updateFloorContainerWidth(floorIndex, lifts) {
    const floorContainer = document.querySelector(`.floor-container.floor-container${floorIndex}`);

    if (floorContainer) {
        const baseWidth = 300;
        const additionalWidth = 60;
        const newWidth = baseWidth + (lifts * additionalWidth);

        floorContainer.style.width = `${newWidth}px`;
    }
}

function showFloorsAndLifts(floors, lifts) {
    for (let i = floors - 1; i >= 0; i--) {
        const floorItem = document.createElement('div');
        floorItem.className = `floor-item floor-item-${i}`;

        const liftBtnContainer = document.createElement('div');
        liftBtnContainer.className = `flex lift-btn-container lift-btn-container-${i}`;

        liftBtnContainer.appendChild(createButton('Up', i, floors));
        liftBtnContainer.appendChild(createButton('Down', i, floors));
        floorItem.appendChild(liftBtnContainer);

        if (i === 0) {
            const liftContainer = document.createElement('div');
            liftContainer.className = `lift-container lift-container${i}`;

            for (let j = 0; j < lifts; j++) {
                const lift = document.createElement('div');
                lift.className = `lift lift${j}`;
                lift.dataset.currentFloor = 0;

                lift.appendChild(createLiftDoors('one', j));
                lift.appendChild(createLiftDoors('two', j));

                lift.style.marginTop = "-64px";
                liftContainer.appendChild(lift);
            }
            floorItem.appendChild(liftContainer);
        } else {
            const liftContainer = document.createElement('div');
            liftContainer.className = `lift-container lift-container${i}`;
            floorItem.appendChild(liftContainer);
        }

        const floorContainer = document.createElement('div');
        floorContainer.className = `flex floor-container floor-container${i}`;

        const floorLine = document.createElement('div');
        floorLine.className = `floor-line floor-line${i}`;

        const floorNumber = document.createElement('p');
        floorNumber.textContent = `Floor ${i + 1}`;

        floorContainer.appendChild(floorNumber);
        floorContainer.appendChild(floorLine);

        floorItem.appendChild(floorContainer);

        liftFloorSection.appendChild(floorItem);

        updateFloorContainerWidth(i, lifts);
    }
    handleLiftBtns(floors, lifts);
}

function startBtnListner(e) {
    e.preventDefault();

    const lifts = liftInput.value;
    const floors = floorInput.value;

    // Check if inputs are empty
    if (lifts === "" || floors === "") {
        alert("Please fill in all required values.");
        return;
    }

    // Check if inputs contain alphabets
    if (/[a-zA-Z]/.test(lifts) || /[a-zA-Z]/.test(floors)) {
        alert("Please enter numeric values only.");
        return;
    }

    // Convert to numbers
    const liftsNum = Number(lifts);
    const floorsNum = Number(floors);

    // Check if inputs are positive integers
    if (!Number.isInteger(liftsNum) || !Number.isInteger(floorsNum) || liftsNum <= 0 || floorsNum <= 0) {
        alert("Please enter positive integers for both lifts and floors.");
        return;
    }

    // Proceed if validation passes
    liftFloorSection.classList.remove('hidden');
    liftFloorSection.innerHTML = '';
    showFloorsAndLifts(floorsNum, liftsNum);
    initializeLifts(liftsNum);
}

startBtn.addEventListener('click', startBtnListner);


    
    const lifts = parseInt(liftInput.value, 10);
    const floors = parseInt(floorInput.value, 10);

    liftFloorSection.classList.remove('hidden');
    liftFloorSection.innerHTML = '';
    showFloorsAndLifts(floors, lifts);
    initializeLifts(lifts);


startBtn.addEventListener('click', startBtnListner);
