// Lingo Interpreter
class LingoInterpreter {
    constructor() {
        this.boxA = 0;
        this.boxB = 0;
        this.output = [];
        this.programCounter = 0;
        this.program = [];
        this.isWaitingForInput = false;
        this.inputCallback = null;
        this.executionDelay = 500;
        this.isRunning = false;
    }

    reset(initialA = 0, initialB = 0) {
        this.boxA = initialA;
        this.boxB = initialB;
        this.output = [];
        this.programCounter = 0;
        this.isWaitingForInput = false;
        this.inputCallback = null;
        this.isRunning = false;
    }

    loadProgram(lines) {
        this.program = lines.map(line => line.trim().toUpperCase()).filter(line => line.length > 0);
        this.programCounter = 0;
    }

    executeCommand(command) {
        // AB - Move A to B
        if (command === 'AB') {
            this.boxB = this.boxA;
            return { success: true, message: `Moved ${this.boxA} from A to B` };
        }
        
        // BA - Move B to A
        if (command === 'BA') {
            this.boxA = this.boxB;
            return { success: true, message: `Moved ${this.boxB} from B to A` };
        }
        
        // IA - Increment A
        if (command === 'IA') {
            this.boxA += 1;
            return { success: true, message: `Incremented A to ${this.boxA}` };
        }
        
        // IB - Increment B
        if (command === 'IB') {
            this.boxB += 1;
            return { success: true, message: `Incremented B to ${this.boxB}` };
        }
        
        // DA - Decrement A
        if (command === 'DA') {
            this.boxA -= 1;
            return { success: true, message: `Decremented A to ${this.boxA}` };
        }
        
        // DB - Decrement B
        if (command === 'DB') {
            this.boxB -= 1;
            return { success: true, message: `Decremented B to ${this.boxB}` };
        }
        
        // MA - Multiply A by 3
        if (command === 'MA') {
            this.boxA *= 3;
            return { success: true, message: `Multiplied A by 3, result: ${this.boxA}` };
        }
        
        // MB - Multiply B by 3
        if (command === 'MB') {
            this.boxB *= 3;
            return { success: true, message: `Multiplied B by 3, result: ${this.boxB}` };
        }
        
        // RA - Read input to A
        if (command === 'RA') {
            return { success: true, message: 'Reading input to A', needsInput: 'A' };
        }
        
        // RB - Read input to B
        if (command === 'RB') {
            return { success: true, message: 'Reading input to B', needsInput: 'B' };
        }
        
        // PA - Print A
        if (command === 'PA') {
            this.output.push(this.boxA);
            return { success: true, message: `Printed A: ${this.boxA}` };
        }
        
        // PB - Print B
        if (command === 'PB') {
            this.output.push(this.boxB);
            return { success: true, message: `Printed B: ${this.boxB}` };
        }
        
        // SAB - Add B to A
        if (command === 'SAB') {
            this.boxA += this.boxB;
            return { success: true, message: `Added B to A, result: ${this.boxA}` };
        }
        
        // SBA - Add A to B
        if (command === 'SBA') {
            this.boxB += this.boxA;
            return { success: true, message: `Added A to B, result: ${this.boxB}` };
        }
        
        // FAJn - Jump if A is not zero
        if (command.startsWith('FAJ')) {
            const lineNum = parseInt(command.substring(3));
            if (isNaN(lineNum)) {
                return { success: false, message: `Invalid jump command: ${command}` };
            }
            if (this.boxA !== 0) {
                this.programCounter = lineNum - 1; // -1 because it will be incremented
                return { success: true, message: `A is ${this.boxA}, jumping to line ${lineNum}` };
            }
            return { success: true, message: `A is 0, not jumping` };
        }
        
        // FBJn - Jump if B is not zero
        if (command.startsWith('FBJ')) {
            const lineNum = parseInt(command.substring(3));
            if (isNaN(lineNum)) {
                return { success: false, message: `Invalid jump command: ${command}` };
            }
            if (this.boxB !== 0) {
                this.programCounter = lineNum - 1; // -1 because it will be incremented
                return { success: true, message: `B is ${this.boxB}, jumping to line ${lineNum}` };
            }
            return { success: true, message: `B is 0, not jumping` };
        }
        
        return { success: false, message: `Unknown command: ${command}` };
    }

    step() {
        if (this.programCounter >= this.program.length) {
            return { done: true, message: 'Program finished' };
        }

        const command = this.program[this.programCounter];
        const result = this.executeCommand(command);
        
        if (result.needsInput) {
            this.isWaitingForInput = true;
            return { ...result, done: false, line: this.programCounter + 1 };
        }

        this.programCounter++;
        return { ...result, done: false, line: this.programCounter };
    }

    provideInput(value, box) {
        if (box === 'A') {
            this.boxA = parseInt(value);
        } else if (box === 'B') {
            this.boxB = parseInt(value);
        }
        this.isWaitingForInput = false;
        this.programCounter++;
    }
}

// Challenge Definitions
const challenges = {
    0: {
        title: 'Tutorial: Learn the Basics',
        description: 'B contains the value 5. Write a program that makes B contain the value 15.',
        initialA: 0,
        initialB: 5,
        goal: { box: 'B', value: 15 },
        solution: ['BA', 'MA', 'AB'],
        maxLines: 5,
        explanation: 'Solution: Move B to A, multiply A by 3 (5×3=15), then move A back to B.'
    },
    1: {
        title: 'Challenge 1: Make A = 9',
        description: 'A contains the value 0. Write a program that makes A contain the value 9.',
        initialA: 0,
        initialB: 0,
        goal: { box: 'A', value: 9 },
        solution: ['IB', 'BA', 'MA', 'MA'],
        maxLines: 5,
        explanation: 'Hint: Increment B to 1, move to A, then multiply by 3 twice (1×3×3=9)'
    },
    2: {
        title: 'Challenge 2: Make B = 10',
        description: 'A contains the value 4. Write a program that makes B contain the value 10.',
        initialA: 4,
        initialB: 0,
        goal: { box: 'B', value: 10 },
        solution: ['MA', 'IB', 'IB', 'AB', 'DB', 'DB'],
        maxLines: 6,
        explanation: 'Hint: Work with A (4×3=12), adjust it to 10, then move to B'
    },
    3: {
        title: 'Challenge 3: Make A = 12',
        description: 'B contains the value 6. Write a program that makes A contain the value 12.',
        initialA: 0,
        initialB: 6,
        goal: { box: 'A', value: 12 },
        solution: ['BA', 'MA', 'IB', 'IB', 'SAB'],
        maxLines: 6,
        explanation: 'Hint: Move B to A, multiply by 3 (6×3=18), then use B to adjust'
    },
    4: {
        title: 'Challenge 4: Countdown',
        description: 'Write a program that reads a positive number and prints all numbers from it to 1. Operations limit: 4',
        initialA: 0,
        initialB: 0,
        goal: { type: 'output', check: 'countdown' },
        solution: ['RB', 'PB', 'DB', 'FBJ2'],
        maxLines: 4,
        explanation: 'Hint: Read to B, print B, decrement B, jump back if B is not 0'
    },
    5: {
        title: 'Challenge 5: Sum Until Zero',
        description: 'A contains the value 0. Write a program that reads numbers until their sum is 0 (example: 1, 3, -2, -2). Operations limit: 4',
        initialA: 0,
        initialB: 0,
        goal: { type: 'custom', check: 'sumToZero' },
        solution: ['RB', 'SAB', 'FAJ1'],
        maxLines: 4,
        explanation: 'Hint: Read to B, add B to A, jump back to line 1 if A is not 0'
    }
};

// UI Controller
class GameUI {
    constructor() {
        this.interpreter = new LingoInterpreter();
        this.currentChallenge = 0;
        this.stepMode = false;
        this.inputQueue = [];
        this.initElements();
        this.bindEvents();
        this.loadChallenge(0);
    }

    initElements() {
        this.boxAElement = document.getElementById('boxA');
        this.boxBElement = document.getElementById('boxB');
        this.challengeDescription = document.getElementById('challengeDescription');
        this.programLines = document.getElementById('programLines');
        this.executionStatus = document.getElementById('executionStatus');
        this.resultMessage = document.getElementById('resultMessage');
        this.outputContainer = document.getElementById('outputContainer');
        this.outputContent = document.getElementById('outputContent');
        this.inputContainer = document.getElementById('inputContainer');
        this.userInput = document.getElementById('userInput');
    }

    bindEvents() {
        // Challenge selector
        document.querySelectorAll('.challenge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const challengeNum = parseInt(e.target.dataset.challenge);
                this.loadChallenge(challengeNum);
            });
        });

        // Command item clicks
        document.addEventListener('click', (e) => {
            const commandItem = e.target.closest('.command-item');
            if (commandItem && !commandItem.classList.contains('advanced-command') || 
                (commandItem && commandItem.classList.contains('advanced-command') && commandItem.classList.contains('show'))) {
                const code = commandItem.querySelector('code').textContent;
                this.insertCommand(code);
            }
        });

        // Line input focus tracking
        document.addEventListener('focusin', (e) => {
            if (e.target.classList.contains('line-input')) {
                document.querySelectorAll('.program-line').forEach(line => {
                    line.classList.remove('focused');
                });
                e.target.closest('.program-line').classList.add('focused');
            }
        });

        // Execution controls
        document.getElementById('runBtn').addEventListener('click', () => this.runProgram());
        document.getElementById('stepBtn').addEventListener('click', () => this.stepProgram());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetProgram());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearProgram());

        // Input submission
        document.getElementById('submitInput').addEventListener('click', () => this.submitInput());
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitInput();
        });
    }

    loadChallenge(num) {
        this.currentChallenge = num;
        const challenge = challenges[num];

        // Update UI
        document.querySelectorAll('.challenge-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.challenge) === num);
        });

        // Show/hide advanced commands for challenges 4 and 5
        const advancedCommands = document.querySelectorAll('.advanced-command');
        advancedCommands.forEach(cmd => {
            if (num === 4 || num === 5) {
                cmd.classList.add('show');
            } else {
                cmd.classList.remove('show');
            }
        });

        this.challengeDescription.innerHTML = `
            <h2>${challenge.title}</h2>
            <p>${challenge.description}</p>
            ${challenge.explanation ? `<p><em>${challenge.explanation}</em></p>` : ''}
        `;

        // Reset interpreter
        this.interpreter.reset(challenge.initialA, challenge.initialB);
        this.updateBoxes();

        // Clear program
        this.clearProgram();
        this.hideInput();
        this.hideOutput();
        this.resultMessage.textContent = '';
        this.resultMessage.className = 'result-message';
        this.executionStatus.textContent = '';

        // Set exactly 4 lines
        this.programLines.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            this.addLine();
        }
    }

    addLine() {
        const currentLines = this.programLines.querySelectorAll('.program-line').length;
        const lineNum = currentLines + 1;
        const lineDiv = document.createElement('div');
        lineDiv.className = 'program-line';
        lineDiv.innerHTML = `
            <span class="line-number">${lineNum}.</span>
            <input type="text" class="line-input" placeholder="Enter command" data-line="${lineNum}">
        `;
        this.programLines.appendChild(lineDiv);
    }

    removeLine() {
        const lines = this.programLines.querySelectorAll('.program-line');
        if (lines.length > 1) {
            lines[lines.length - 1].remove();
        }
    }

    insertCommand(command) {
        // Check if there's a focused input
        const focusedLine = document.querySelector('.program-line.focused');
        if (focusedLine) {
            const input = focusedLine.querySelector('.line-input');
            // If input is empty or has FBJ command that needs a number, insert accordingly
            if (command.includes('FBJn')) {
                input.value = 'FBJ';
                // Focus and place cursor at end
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            } else {
                input.value = command;
                // Move to next line if available
                const nextLine = focusedLine.nextElementSibling;
                if (nextLine) {
                    nextLine.querySelector('.line-input').focus();
                }
            }
            return;
        }

        // Otherwise, find first empty input
        const inputs = this.programLines.querySelectorAll('.line-input');
        for (let input of inputs) {
            if (!input.value.trim()) {
                if (command.includes('FBJn')) {
                    input.value = 'FBJ';
                    input.focus();
                    input.setSelectionRange(input.value.length, input.value.length);
                } else {
                    input.value = command;
                }
                return;
            }
        }
    }

    clearProgram() {
        const inputs = this.programLines.querySelectorAll('.line-input');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error');
        });
    }

    getProgramLines() {
        const inputs = this.programLines.querySelectorAll('.line-input');
        return Array.from(inputs).map(input => input.value.trim().toUpperCase());
    }

    updateBoxes(highlightBox = null) {
        this.boxAElement.textContent = this.interpreter.boxA;
        this.boxBElement.textContent = this.interpreter.boxB;

        // Add animation
        this.boxAElement.classList.remove('changed');
        this.boxBElement.classList.remove('changed');
        
        setTimeout(() => {
            if (highlightBox === 'A' || highlightBox === 'both') {
                this.boxAElement.classList.add('changed');
                this.boxAElement.parentElement.classList.add('highlight');
                setTimeout(() => this.boxAElement.parentElement.classList.remove('highlight'), 600);
            }
            if (highlightBox === 'B' || highlightBox === 'both') {
                this.boxBElement.classList.add('changed');
                this.boxBElement.parentElement.classList.add('highlight');
                setTimeout(() => this.boxBElement.parentElement.classList.remove('highlight'), 600);
            }
        }, 10);
    }

    highlightLine(lineNum) {
        const lines = this.programLines.querySelectorAll('.program-line');
        lines.forEach((line, idx) => {
            line.classList.toggle('executing', idx === lineNum - 1);
        });
    }

    showMessage(message, type = 'info') {
        this.resultMessage.textContent = message;
        this.resultMessage.className = `result-message ${type}`;
    }

    showOutput() {
        this.outputContainer.style.display = 'block';
        this.outputContent.textContent = this.interpreter.output.join(', ');
    }

    hideOutput() {
        this.outputContainer.style.display = 'none';
        this.outputContent.textContent = '';
    }

    showInput(box) {
        this.inputContainer.style.display = 'flex';
        this.userInput.value = '';
        this.userInput.focus();
        this.userInput.dataset.box = box;
    }

    hideInput() {
        this.inputContainer.style.display = 'none';
    }

    submitInput() {
        const value = parseInt(this.userInput.value);
        if (isNaN(value)) {
            alert('Please enter a valid number');
            return;
        }

        const box = this.userInput.dataset.box;
        this.interpreter.provideInput(value, box);
        this.hideInput();
        this.updateBoxes(box);

        if (this.stepMode) {
            this.executionStatus.textContent = `Input ${value} stored in Box ${box}`;
        } else {
            setTimeout(() => this.continueExecution(), this.interpreter.executionDelay);
        }
    }

    async runProgram() {
        const lines = this.getProgramLines().filter(line => line.length > 0);
        if (lines.length === 0) {
            this.showMessage('Please enter at least one command', 'error');
            return;
        }

        this.resetProgram();
        this.interpreter.loadProgram(lines);
        this.interpreter.isRunning = true;
        this.stepMode = false;

        await this.continueExecution();
    }

    async continueExecution() {
        while (this.interpreter.programCounter < this.interpreter.program.length && 
               this.interpreter.isRunning && 
               !this.interpreter.isWaitingForInput) {
            
            const result = this.interpreter.step();
            
            this.highlightLine(result.line);
            this.executionStatus.textContent = result.message;

            // Determine which box(es) changed
            const command = this.interpreter.program[this.interpreter.programCounter - 1];
            let highlightBox = null;
            if (command && (command.includes('A') || command.startsWith('MA') || command.startsWith('IA') || 
                           command.startsWith('DA') || command.startsWith('BA') || command.startsWith('SAB'))) {
                highlightBox = 'A';
            }
            if (command && (command.includes('B') || command.startsWith('MB') || command.startsWith('IB') || 
                           command.startsWith('DB') || command.startsWith('AB') || command.startsWith('SBA'))) {
                highlightBox = highlightBox === 'A' ? 'both' : 'B';
            }

            this.updateBoxes(highlightBox);

            if (this.interpreter.output.length > 0) {
                this.showOutput();
            }

            if (result.needsInput) {
                this.showInput(result.needsInput);
                return;
            }

            if (result.done) {
                this.checkSolution();
                return;
            }

            if (!result.success) {
                this.showMessage(result.message, 'error');
                this.interpreter.isRunning = false;
                return;
            }

            await new Promise(resolve => setTimeout(resolve, this.interpreter.executionDelay));
        }

        if (this.interpreter.programCounter >= this.interpreter.program.length) {
            this.checkSolution();
        }
    }

    stepProgram() {
        const lines = this.getProgramLines().filter(line => line.length > 0);
        if (lines.length === 0) {
            this.showMessage('Please enter at least one command', 'error');
            return;
        }

        if (!this.interpreter.isRunning) {
            this.resetProgram();
            this.interpreter.loadProgram(lines);
            this.interpreter.isRunning = true;
            this.stepMode = true;
        }

        if (this.interpreter.isWaitingForInput) {
            this.showMessage('Please provide input first', 'info');
            return;
        }

        if (this.interpreter.programCounter >= this.interpreter.program.length) {
            this.showMessage('Program finished', 'info');
            this.checkSolution();
            return;
        }

        const result = this.interpreter.step();
        
        this.highlightLine(result.line);
        this.executionStatus.textContent = result.message;

        // Determine which box changed
        const command = this.interpreter.program[this.interpreter.programCounter - 1];
        let highlightBox = null;
        if (command && command.includes('A')) highlightBox = 'A';
        if (command && command.includes('B')) highlightBox = highlightBox === 'A' ? 'both' : 'B';

        this.updateBoxes(highlightBox);

        if (this.interpreter.output.length > 0) {
            this.showOutput();
        }

        if (result.needsInput) {
            this.showInput(result.needsInput);
            return;
        }

        if (result.done || this.interpreter.programCounter >= this.interpreter.program.length) {
            this.checkSolution();
        }

        if (!result.success) {
            this.showMessage(result.message, 'error');
            this.interpreter.isRunning = false;
        }
    }

    resetProgram() {
        const challenge = challenges[this.currentChallenge];
        this.interpreter.reset(challenge.initialA, challenge.initialB);
        this.updateBoxes();
        this.executionStatus.textContent = '';
        this.resultMessage.textContent = '';
        this.resultMessage.className = 'result-message';
        this.hideInput();
        this.hideOutput();
        this.stepMode = false;

        const lines = this.programLines.querySelectorAll('.program-line');
        lines.forEach(line => line.classList.remove('executing'));
    }

    checkSolution() {
        const challenge = challenges[this.currentChallenge];
        const goal = challenge.goal;

        if (goal.type === 'output' && goal.check === 'countdown') {
            // For countdown challenge, we can't fully validate without knowing input
            // Just check if output exists
            if (this.interpreter.output.length > 0) {
                this.showMessage('✅ Program executed! Check if output is correct for your input.', 'success');
            } else {
                this.showMessage('❌ No output produced. Did you print the numbers?', 'error');
            }
        } else if (goal.type === 'custom' && goal.check === 'sumToZero') {
            // For sum to zero, check if A is 0
            if (this.interpreter.boxA === 0) {
                this.showMessage('✅ Correct! A is 0 after summing the inputs.', 'success');
            } else {
                this.showMessage('❌ A should be 0 after summing inputs until zero.', 'error');
            }
        } else {
            // Standard goal check
            const box = goal.box === 'A' ? this.interpreter.boxA : this.interpreter.boxB;
            if (box === goal.value) {
                this.showMessage(`✅ Correct! Box ${goal.box} = ${goal.value}`, 'success');
            } else {
                this.showMessage(`❌ Not quite. Box ${goal.box} is ${box}, should be ${goal.value}`, 'error');
            }
        }

        this.interpreter.isRunning = false;
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameUI();
});
