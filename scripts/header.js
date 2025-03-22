const searchPrompts = document.getElementById('search-prompts');
const sortButton = document.querySelector('.sort-button');
const addButton = document.querySelector('.add-button');
const infoButton = document.querySelector('.info-button');

let customPrompts = JSON.parse(localStorage.getItem('customPrompts')) || [];

searchPrompts.addEventListener('input', e => {
    window.searchTerm = e.target.value;
    if (typeof createPromptButtons === 'function') {
        createPromptButtons();
    }
});

sortButton.addEventListener('click', () => {
    const currentSort = window.sortOrder || 'az';
    const azChecked = currentSort === 'az' ? 'checked' : '';
    const zaChecked = currentSort === 'za' ? 'checked' : '';

    const applyButtonId = `apply-sort-${Date.now()}`;

    const modal = new Modal(`
        <div class="title">Sort</div>
        <div class="group">
            <input type="radio" id="A-Z" name="sort" value="az" ${azChecked}>
            <span for="A-Z">A-Z</span>
        </div>
        <div class="group">
            <input type="radio" id="Z-A" name="sort" value="za" ${zaChecked}>
            <span for="Z-A">Z-A</span>
        </div>
        <button class="apply-modal" id="${applyButtonId}">Apply</button>
    `);
    modal.show();

    setTimeout(() => {
        const modalElement = modal.element || document;
        const applyButton = modalElement.querySelector(`#${applyButtonId}`);
        if (applyButton) {
            applyButton.addEventListener('click', () => {
                const selectedOrder = modalElement.querySelector('input[name="sort"]:checked').value;
                window.sortOrder = selectedOrder;
                if (typeof createPromptButtons === 'function') {
                    createPromptButtons();
                }
                modal.remove();
            }, { once: true });
        }
    }, 0);
});

addButton.addEventListener('click', () => {
    const modal = new Modal(`
        <div class="title">Add Prompt</div>
        <div class="content">
            <div class="group vertical-group">
                <label for="act">Act:</label>
                <input type="text" id="act" name="act" maxlength="50" required>
            </div>
            <div class="group vertical-group">
                <label for="prompt">Prompt:</label>
                <textarea id="prompt" name="prompt" maxlength="3500" required></textarea>
                <small>0/3500</small>
            </div>
            <button id="apply-add" class="apply-modal">Add</button>
        </div>
    `);
    modal.show();

    const modalElement = modal.element || document;
    const actElement = modalElement.querySelector('#act');
    const promptElement = modalElement.querySelector('#prompt');
    const smallElement = modalElement.querySelector('small');
    const applyButton = modalElement.querySelector('#apply-add');

    promptElement.addEventListener('input', () => {
        smallElement.textContent = `${promptElement.value.length}/3500`;
    });

    applyButton.addEventListener('click', () => {
        if (actElement.value.trim() === '' || promptElement.value.trim() === '') {
            alert('Please fill out both fields');
            return;
        }
        if (customPrompts.some(row => row.act === actElement.value)) {
            alert('Act already exists');
            return;
        }

        customPrompts.push({
            act: actElement.value,
            prompt: promptElement.value
        });
        localStorage.setItem('customPrompts', JSON.stringify(customPrompts));
        createPromptButtons();

        modal.remove();
    });
});

infoButton.addEventListener('click', () => {
    fetch('../manifest.json')
        .then(response => response.json())
        .then(data => {
            const modal = new Modal(`
                <div class="title">About</div>
                <div class="content">
                    <table>
                        <tr>
                            <th>Name</th>
                            <td>${data.name}</td>
                        </tr>
                        <tr>
                            <th>Description</th>
                            <td>${data.description}</td>
                        </tr>
                        <tr>
                            <th>Version</th>
                            <td>${data.version}</td>
                        </tr>
                        <tr>
                            <th>Author</th>
                            <td>${data.author}</td>
                        </tr>
                    </table>
                </div>
            `);
            modal.show();
        })
        .catch(error => {
            console.error('Error loading manifest.json:', error);
        });
});