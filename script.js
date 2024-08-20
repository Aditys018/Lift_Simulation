document.addEventListener('DOMContentLoaded', () => {
    const lifts = document.querySelectorAll('.lift');
    const floors = document.querySelectorAll('.floor');
    const floorHeight = 90; // height of each floor (same as .floor in CSS)

    // Initialize lift positions on the first floor
    lifts.forEach(lift => {
        lift.style.transform = `translateY(${(floors.length - 1) * floorHeight}px)`;
        lift.dataset.currentFloor = '1';
    });

    // Function to move the lift to the desired floor
    function moveLift(lift, targetFloor) {
        const targetPosition = (floors.length - targetFloor) * floorHeight;
        
        console.log(`Moving lift to floor ${targetFloor}`);
        lift.style.transform = `translateY(${targetPosition}px)`;
        lift.dataset.currentFloor = targetFloor;
    }

    // Handle the button clicks
    document.querySelectorAll('.buttons button').forEach(button => {
        button.addEventListener('click', () => {
            const targetFloor = parseInt(button.dataset.floor);
            const direction = button.classList.contains('up') ? 'up' : 'down';

            // Find the lift on the same floor and move it
            const floorLifts = button.closest('.floor').querySelectorAll('.lift');
            floorLifts.forEach(lift => {
                const currentFloor = parseInt(lift.dataset.currentFloor);

                if ((direction === 'up' && currentFloor < targetFloor) ||
                    (direction === 'down' && currentFloor > targetFloor)) {
                    moveLift(lift, targetFloor);
                }
            });
        });
    });
});
