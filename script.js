let currLiftPositionArr = [];
let noOfFloors;
let noOfLifts;
let liftCallsQueue = [];
let intervalId;
let allLiftInfo;
let activeLiftsDestinations = [];
currLiftPositionArr = []; 



document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    startVirtualSimulation();
});

function startVirtualSimulation() {
    clearInterval(intervalId);
    if (validateLiftAndFloorEntries()) {
        generateFloors(noOfFloors);
        generateLifts(noOfLifts);
        addButtonFunctionalities();
        intervalId = setInterval(fullfillLiftCallsQueue, 1000);
    }
}

const validateLiftAndFloorEntries = () => {
    noOfFloors = document.getElementById('noOfFloors').value;
    noOfLifts = document.getElementById('noOfLifts').value;

    if (window.innerWidth <= 480 && noOfLifts > 3) {
        alert("This screen size can't have more than 3 lifts");
        return false;
    }
    if (window.innerWidth > 481 && window.innerWidth <= 767 && noOfLifts > 5) {
        alert("This screen size can't have more than 5 lifts");
        return false;
    }

    if (noOfFloors === '' || noOfLifts === '') {
        alert('Enter valid numbers for floors and lifts');
        return false;
    }

    if (noOfFloors <= 0 || noOfLifts <= 0) {
        alert('Negative values or zero are not supported');
        return false;
    }

    return true;
};

const generateFloors = (n) => {
    document.getElementById('simulationArea').innerHTML = '';
    for (let i = 0; i < n; i++) {
        let currLevel = `L${n - i - 1}`;
        let floorNo = `Floor${n - i}`;
        let currFloor = document.createElement('div');
        currFloor.setAttribute('id', floorNo);
        currFloor.classList.add('floor');

        const isTopFloor = i === 0;
        const isGroundFloor = i === n - 1;

        currFloor.innerHTML = `
            <p>${floorNo}</p>
            <div>
                ${isTopFloor ? '' : `<button id=up${currLevel} class="button-floor upBttn">▲</button>`}
                ${isGroundFloor ? '' : `<button id=down${currLevel} class="button-floor downBttn">▼</button>`}
            </div>
        `;

        document.getElementById('simulationArea').appendChild(currFloor);
    }
};

function addButtonFunctionalities() {
    const allButtons = document.querySelectorAll('.button-floor');
    allButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetFlr = parseInt(btn.id.split('L')[1]);
            console.log(`Button clicked: ${btn.id}, Target Floor: ${targetFlr}`);
            
            if (!activeLiftsDestinations.includes(targetFlr)) {
                activeLiftsDestinations.push(targetFlr);
                liftCallsQueue.push(targetFlr);
            }
        });
    });
}


function translateLift(liftNo, targetLiftPosn) {
    const reqLift = document.getElementById(`Lift-${liftNo}`);
    let currLiftPosn = parseInt(currLiftPositionArr[liftNo]);

    console.log(`Translating Lift ${liftNo}: Current Position: ${currLiftPosn}, Target Position: ${targetLiftPosn}`);

    if (currLiftPosn != targetLiftPosn) {
        allLiftInfo[liftNo].inMotion = true;
        let unitsToMove = parseInt(Math.abs(targetLiftPosn - currLiftPosn) + 1);
        let motionDis = -100 * parseInt(targetLiftPosn);

        reqLift.style.transitionTimingFunction = 'linear';
        reqLift.style.transform = `translateY(${motionDis}px)`;
        reqLift.style.transitionDuration = `${unitsToMove * 1}s`;

        let timeInMs = unitsToMove * 1200;
        setTimeout(() => {
            currLiftPositionArr[liftNo] = targetLiftPosn;
            animateLiftsDoors(liftNo, targetLiftPosn);
        }, timeInMs);
    } else {
        allLiftInfo[liftNo].inMotion = true;
        animateLiftsDoors(liftNo, targetLiftPosn);
    }
}

function animateLiftsDoors(liftNo, targetLiftPosn) {
    const leftGate = document.getElementById(`L${liftNo}left_gate`);
    const rightGate = document.getElementById(`L${liftNo}right_gate`);
    leftGate.classList.toggle('animateLiftsDoorsOnFloorStop');
    rightGate.classList.toggle('animateLiftsDoorsOnFloorStop');

    setTimeout(() => {
        allLiftInfo[liftNo].inMotion = false;
        leftGate.classList.toggle('animateLiftsDoorsOnFloorStop');
        rightGate.classList.toggle('animateLiftsDoorsOnFloorStop');
        activeLiftsDestinations = activeLiftsDestinations.filter((item) => item !== targetLiftPosn);
    }, 2000);
}

function findNearestFreeLift(flrNo) {
    let prevDiff = Number.MAX_SAFE_INTEGER;
    let nearestAvailableLift = -1;

    for (let i = 0; i < currLiftPositionArr.length; i++) {
        if (allLiftInfo[i].inMotion == false) {
            const currDiff = Math.abs(currLiftPositionArr[i] - flrNo);
            if (currDiff < prevDiff) {
                prevDiff = currDiff;
                nearestAvailableLift = i;
            }
        }
    }

    console.log(`Nearest Available Lift for Floor ${flrNo}: Lift ${nearestAvailableLift}`);
    return nearestAvailableLift;
}

const generateLifts = (n) => {
    allLiftInfo = [];
    for (let i = 0; i < n; i++) {
        let liftNo = `Lift-${i}`;
        const currLift = document.createElement('div');
        currLift.setAttribute('id', liftNo);
        currLift.classList.add('lifts');
        currLift.innerHTML = `
            <p>Lift${i + 1}</p>
            <div class="gate gateLeft" id="L${i}left_gate"></div>
            <div class="gate gateRight" id="L${i}right_gate"></div>
        `;
        currLift.style.left = `${(i + 1) * 90}px`;
        currLift.style.top = '0px';
        document.getElementById('Floor1').appendChild(currLift);
        currLiftPositionArr[i] = 0;

        const currLiftDetail = {};
        currLiftDetail.id = liftNo;
        currLiftDetail.inMotion = false;
        allLiftInfo.push(currLiftDetail);
    }
};

function fullfillLiftCallsQueue() {
    if (!(liftCallsQueue.length)) return;
    let targetFlr = liftCallsQueue[0];
    
    console.log(`Processing Lift Calls Queue: Target Floor ${targetFlr}`);
    
    const liftToMove = findNearestFreeLift(targetFlr);
    if (liftToMove != -1) {
        translateLift(liftToMove, targetFlr);
        liftCallsQueue.shift();
    }
}
