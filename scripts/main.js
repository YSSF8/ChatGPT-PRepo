window.sortOrder = window.sortOrder || 'az';

const parser = new CSVParser('./data/prompts.csv');
const promptContainer = document.getElementById('prompt-container');
const prompts = [];
const startTime = performance.now();

parser.addEventListener('data', e => {
    prompts.push(e.detail);
});

parser.addEventListener('error', e => {
    console.error('Error parsing CSV:', e.detail);
});

parser.addEventListener('end', () => {
    createPromptButtons();
    calculateExecutionTime();
    console.log('Finished parsing CSV file');
});

function createPromptButtons() {
    promptContainer.innerHTML = '';

    const allPrompts = [...prompts, ...customPrompts];

    let sortedPrompts = allPrompts.slice().sort((a, b) => {
        const aIsFav = isFavorite(a) ? 1 : 0;
        const bIsFav = isFavorite(b) ? 1 : 0;
        if (aIsFav !== bIsFav) {
            return bIsFav - aIsFav;
        }
        if (window.sortOrder === 'za') {
            return b.act.localeCompare(a.act);
        }
        return a.act.localeCompare(b.act);
    });

    if (window.searchTerm && window.searchTerm.trim() !== '') {
        const term = window.searchTerm.toLowerCase();
        sortedPrompts = sortedPrompts.filter(row => {
            if (term === 'custom') {
                return customPrompts.some(p => p.act === row.act);
            }
            return row.act.toLowerCase().includes(term);
        });
    }

    const actCount = new Map();
    sortedPrompts.forEach(row => {
        actCount.set(row.act, (actCount.get(row.act) || 0) + 1);
    });

    const seen = new Map();
    sortedPrompts.forEach(row => {
        const button = document.createElement('button');
        button.classList.add('prompt-button');

        if (actCount.get(row.act) > 1) {
            const count = (seen.get(row.act) || 0) + 1;
            seen.set(row.act, count);
            button.textContent = `${row.act} (${count})`;
        } else {
            button.textContent = row.act;
        }

        button.addEventListener('contextmenu', e => {
            e.preventDefault();
            e.stopPropagation();
            showContextMenu(e, row);
        });

        button.addEventListener('click', () => {
            insertPromptToChatGPT(row.prompt);
        });

        if (customPrompts.some(p => p.act === row.act)) {
            button.style.borderLeft = '3px solid var(--scrollbar-color)';
        }

        if (isFavorite(row)) {
            button.style.backgroundColor = 'var(--favorite-highlight-color)';
        }

        promptContainer.appendChild(button);
    });
}

let activeContextMenu = null;

function showContextMenu(e, row) {
    e.preventDefault();
    e.stopPropagation();

    if (activeContextMenu) {
        activeContextMenu.hide();
        activeContextMenu = null;
    }

    const isCustom = customPrompts.some(p => p.act === row.act);
    const menuItems = {
        'Favorite': () => {
            toggleFavorite(row);
            createPromptButtons();
        }
    };

    if (isCustom) {
        menuItems['Edit'] = () => {
            openEditPrompt(row);
        };
        menuItems['Remove'] = () => {
            customPrompts = customPrompts.filter(p => p.act !== row.act);
            localStorage.setItem('customPrompts', JSON.stringify(customPrompts));
            createPromptButtons();
        };
    }

    const menu = new ContextMenu(menuItems);

    const originalHide = menu.hide.bind(menu);
    menu.hide = () => {
        originalHide();
        if (activeContextMenu === menu) {
            activeContextMenu = null;
        }
    };

    activeContextMenu = menu;
    menu.show(e.pageX, e.pageY);
}

function openEditPrompt(originalPrompt) {
    const modal = new Modal(`
        <div class="title">Edit Prompt</div>
        <div class="content">
            <div class="group vertical-group">
                <label for="act">Act:</label>
                <input type="text" id="act" name="act" value="${originalPrompt.act}" maxlength="50" required>
            </div>
            <div class="group vertical-group">
                <label for="prompt">Prompt:</label>
                <textarea id="prompt" name="prompt" maxlength="3500" required>${originalPrompt.prompt}</textarea>
                <small>${originalPrompt.prompt.length}/3500</small>
            </div>
            <button id="apply-edit" class="apply-modal">Save</button>
        </div>
    `);
    modal.show();

    const modalElement = modal.element || document;
    const actElement = modalElement.querySelector('#act');
    const promptElement = modalElement.querySelector('#prompt');
    const smallElement = modalElement.querySelector('small');
    const applyButton = modalElement.querySelector('#apply-edit');

    promptElement.addEventListener('input', () => {
        smallElement.textContent = `${promptElement.value.length}/3500`;
    });

    applyButton.addEventListener('click', () => {
        if (!actElement.value || !promptElement.value) {
            alert('Please fill out both fields');
            return;
        }
        if (actElement.value !== originalPrompt.act && customPrompts.some(p => p.act === actElement.value)) {
            alert('Act already exists');
            return;
        }
        const index = customPrompts.findIndex(p => p.act === originalPrompt.act);
        if (index !== -1) {
            customPrompts[index] = {
                ...customPrompts[index],
                act: actElement.value,
                prompt: promptElement.value
            };
            localStorage.setItem('customPrompts', JSON.stringify(customPrompts));
            createPromptButtons();
        }
        modal.remove();
    });
}

function calculateExecutionTime() {
    const endTime = performance.now();
    const loadTime = ((endTime - startTime) / 1000).toFixed(2);
    const numberOfPrompts = prompts.length;

    console.log(`Loaded ${numberOfPrompts} prompts in ${loadTime} seconds`);
}

async function insertPromptToChatGPT(prompt) {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('chatgpt.com')) {
            alert('Please open ChatGPT first!');
            return;
        }

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: promptText => {
                const promptTextarea = document.getElementById('prompt-textarea');
                const prompt = promptTextarea.querySelector('p');

                if (!promptTextarea && !prompt) {
                    alert('Could not find the prompt input field.');
                    return;
                }

                prompt.textContent = promptText;
            },
            args: [prompt]
        });
    } catch (error) {
        console.error('Error inserting prompt:', error);
    }
}

parser.parse();