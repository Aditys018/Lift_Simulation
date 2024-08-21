document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('building-form');
    const buildingContainer = document.getElementById('building-container');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Clear previous building content
        buildingContainer.innerHTML = '';

        // Get user inputs
        const numFloors = parseInt(document.getElementById('numFloors').value);
        const numLifts = parseInt(document.getElementById('numLifts').value);

        // Generate floors
        for (let i = 0; i < numFloors; i++) {
            const floor = document.createElement('div');
            floor.className = 'floor';
            floor.id = `floor-${i}`;
            floor.innerHTML = `
                <div class="floor-info">
                    <div class="floor-number">Floor ${numFloors - i}</div>
                    <div class="buttons">
                        ${Array.from({ length: numLifts }, (_, j) => `
                            <div class="control">
                                <button class="up">▲</button>
                                <button class="down">▼</button>
                            </div>
                            <div class="empty-box"></div>
                        `).join('')}
                    </div>
                </div>
            `;
            buildingContainer.appendChild(floor);
        }

        // Generate lifts
        const liftsContainer = document.createElement('div');
        liftsContainer.className = 'lifts';
        liftsContainer.innerHTML = Array.from({ length: numLifts }, (_, i) => `
            <div class="lift" id="lift-${i + 1}"></div>
        `).join('');
        buildingContainer.appendChild(liftsContainer);
    });
});
