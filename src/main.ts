import './index.css';
import { PART_LIBRARY, type RobotPart } from './parts';

class TheEngineer {
  private workspace: HTMLElement;
  private sidebar: HTMLElement;
  private placedParts: Map<string, HTMLElement> = new Map();
  private zIndexCounter = 10;
  private facts = [
    "The first digital and programmable robot was called Unimate (1954).",
    "Robots can be 'soft'! Researchers use silicon and fluids to make squishy robots for surgery.",
    "The Curiosity Rover on Mars has its own Twitter account.",
    "Isaac Asimov created the 'Three Laws of Robotics' in 1942.",
    "NASA's Voyager 1 is the furthest human-made 'robot' from Earth.",
    "Deep Blue was the first computer to beat a world chess champion (Garry Kasparov).",
    "The word 'cyborg' is short for 'cybernetic organism'.",
    "Autonomous underwater vehicles (AUVs) can map the seafloor without human control.",
    "Nanobots are being designed to deliver medicine to specific cells in the body.",
    "The 'Karel' programming language was named after Karel Čapek, who popularized the word robot."
  ];
  private currentFactIndex = 0;

  private anatomyMap: Record<string, string> = {
    'Brain': 'The Nervous System. It processes logic and controls electrical signals. Like your brain, it makes decisions based on sensor inputs.',
    'Joint': 'The Muscular System. It converts electrical energy into physical motion. Servos and steppers allow the robot to interact with the physical world.',
    'Energy': 'The Digestive System. It stores and provides the voltage required for the robot to live. Without a proper power source, the electronics will fail.',
    'Sensor': 'The Senses (Sight, Touch). It allows the robot to understand its environment. Sensors give the brain the data it needs to avoid obstacles or find objects.',
    'Frame': 'The Skeletal System. It holds everything together and provides strength. A strong frame prevents vibrations and protects sensitive electronics.'
  };

  private generalRoboticsInfo = [
    { title: "Laws of Robotics", text: "Asimov's laws state that a robot may not injure a human being or, through inaction, allow a human to come to harm." },
    { title: "Degrees of Freedom", text: "DOF refers to the number of independent ways a mechanical system can move. A simple hinge has 1 DOF, while a human arm has 7." },
    { title: "PID Control", text: "A control loop mechanism (Proportional-Integral-Derivative) widely used in industrial control systems to keep variables stable." },
    { title: "Actuators", text: "Devices like motors and cylinders that convert electricity or air pressure into physical force and motion." },
    { title: "The Turing Test", text: "A test of a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human." }
  ];

  constructor() {
    this.workspace = document.getElementById('workspace')!;
    this.sidebar = document.getElementById('sidebar-content')!;
    this.init();
  }

  private init() {
    this.renderSidebar();
    this.setupWorkspaceEvents();
    this.setupModals();
    this.startFactRotation();
    this.renderGeneralInfo();
  }

  private renderGeneralInfo() {
    const container = document.getElementById('general-info-display');
    if (container) {
      container.innerHTML = this.generalRoboticsInfo.map(info => `
        <div class="info-block" style="margin-bottom: 1rem;">
          <h4 style="font-size: 0.8rem; color: var(--accent-purple); text-transform: uppercase;">${info.title}</h4>
          <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3;">${info.text}</p>
        </div>
      `).join('');
    }
  }

  private startFactRotation() {
    const factEl = document.getElementById('fact-display');
    setInterval(() => {
      this.currentFactIndex = (this.currentFactIndex + 1) % this.facts.length;
      if (factEl) {
        factEl.style.opacity = '0';
        setTimeout(() => {
          factEl.innerText = this.facts[this.currentFactIndex];
          factEl.style.opacity = '1';
        }, 500);
      }
    }, 10000);
  }

  private renderSidebar() {
    const categories = Array.from(new Set(PART_LIBRARY.map(p => p.type)));

    this.sidebar.innerHTML = categories.map(cat => `
      <div class="category-group">
        <h3 class="category-title">${cat}</h3>
        <div class="part-grid">
          ${PART_LIBRARY.filter(p => p.type === cat).map(p => this.createSidebarPartElement(p)).join('')}
        </div>
      </div>
    `).join('');

    // Add drag events to sidebar items
    this.sidebar.querySelectorAll('.sidebar-part').forEach(el => {
      el.addEventListener('dragstart', (e: any) => {
        e.dataTransfer.setData('part-id', el.getAttribute('data-id')!);
      });
    });
  }

  private createSidebarPartElement(part: RobotPart): string {
    return `
      <div class="sidebar-part glass-panel" draggable="true" data-id="${part.id}">
        <img src="${part.image}" alt="${part.realName}" onerror="this.src='https://placehold.co/60x60/1a1a2e/ffffff?text=${part.name}'">
        <div class="part-info">
          <span class="part-label">${part.name}</span>
          <span class="part-name">${part.realName}</span>
        </div>
      </div>
    `;
  }

  private setupWorkspaceEvents() {
    this.workspace.addEventListener('dragover', (e) => e.preventDefault());

    this.workspace.addEventListener('drop', (e) => {
      e.preventDefault();
      const partId = e.dataTransfer?.getData('part-id');
      if (!partId) return;

      const part = PART_LIBRARY.find(p => p.id === partId);
      if (!part) return;

      const rect = this.workspace.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.placePart(part, x, y);
      this.updateChecklist();
    });
  }

  private updateChecklist() {
    const parts = Array.from(this.placedParts.values()).map(el => {
      const name = (el.querySelector('.placed-part-name') as HTMLElement)?.innerText;
      return PART_LIBRARY.find(p => p.realName === name);
    });

    const has = (type: string) => parts.some(p => p?.type === type);

    ['Brain', 'Energy', 'Joint'].forEach(type => {
      const el = document.querySelector(`.check-item[data-type="${type}"]`) as HTMLElement;
      if (el) {
        const isValid = has(type);
        el.innerText = `${type === 'Energy' ? 'Power' : type === 'Joint' ? 'Motion' : type}: ${isValid ? '✅' : '❌'}`;
        el.classList.toggle('valid', isValid);
      }
    });
  }

  private placePart(part: RobotPart, x: number, y: number) {
    const id = `placed-${Date.now()}`;
    const el = document.createElement('div');
    el.className = 'placed-part';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.zIndex = (++this.zIndexCounter).toString();
    el.innerHTML = `
      <div class="part-controls">
        <button class="rotate-btn">↻</button>
        <button class="delete-btn">×</button>
      </div>
      <img src="${part.image}" alt="${part.realName}" onerror="this.src='https://placehold.co/100x100/1a1a2e/ffffff?text=${part.name}'">
      <div class="placed-part-name">${part.realName}</div>
    `;

    // Handle interactions
    let rotation = 0;
    el.querySelector('.rotate-btn')?.addEventListener('click', () => {
      rotation = (rotation + 45) % 360;
      (el.querySelector('img') as HTMLElement).style.transform = `rotate(${rotation}deg)`;
    });

    el.querySelector('.delete-btn')?.addEventListener('click', () => {
      el.remove();
      this.placedParts.delete(id);
    });

    // Simple drag to move
    let isDragging = false;
    let startX: number, startY: number;

    el.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('.part-controls')) return;
      isDragging = true;
      startX = e.clientX - el.offsetLeft;
      startY = e.clientY - el.offsetTop;
      el.style.zIndex = (++this.zIndexCounter).toString();

      // Update anatomy guide
      const anatomyEl = document.getElementById('anatomy-explanation');
      if (anatomyEl) anatomyEl.innerText = this.anatomyMap[part.type] || 'A structural component.';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      el.style.left = `${e.clientX - startX}px`;
      el.style.top = `${e.clientY - startY}px`;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    this.workspace.appendChild(el);
    this.placedParts.set(id, el);
  }

  private setupModals() {
    // Phase transition buttons
    document.getElementById('btn-next-step')?.addEventListener('click', () => {
      this.showStep2();
    });

    document.getElementById('btn-generate')?.addEventListener('click', () => {
      this.handleAIGeneration();
    });
  }

  private showStep2() {
    const modal = document.getElementById('ai-modal')!;
    modal.classList.add('visible');
  }

  private async handleAIGeneration() {
    const prompt = (document.getElementById('robot-prompt') as HTMLTextAreaElement).value;
    if (!prompt) return;

    const btn = document.getElementById('btn-generate') as HTMLButtonElement;
    btn.disabled = true;
    btn.innerText = 'Consulting AI Brain...';

    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 2000));

    const modal = document.getElementById('ai-modal')!;
    modal.classList.remove('visible');

    this.showTestingView(prompt);
  }

  private showTestingView(prompt: string) {
    const testView = document.getElementById('test-view')!;
    testView.classList.remove('hidden');
    testView.classList.add('visible');

    const resultsArea = document.querySelector('.scan-results')!;
    resultsArea.innerHTML = `
      <h2>Scanning Robot Anatomy...</h2>
      <div class="scan-line-progress"></div>
      <div id="scan-log" class="scan-log"></div>
    `;

    this.runHardwareValidation(prompt);
  }

  private async runHardwareValidation(prompt: string) {
    const log = document.getElementById('scan-log')!;
    const addLog = (msg: string, type: 'info' | 'error' | 'success') => {
      const p = document.createElement('p');
      p.className = `log-${type}`;
      p.innerText = `> ${msg}`;
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
    };

    await new Promise(r => setTimeout(r, 1000));
    addLog('Identifying components...', 'info');

    const partsInWorkspace = Array.from(this.placedParts.values()).map(el => {
      const name = (el.querySelector('.placed-part-name') as HTMLElement)?.innerText;
      return PART_LIBRARY.find(p => p.realName === name);
    }).filter(Boolean) as RobotPart[];

    await new Promise(r => setTimeout(r, 1000));
    addLog(`Found ${partsInWorkspace.length} components.`, 'info');

    // Simple requirement logic
    const needsCamera = prompt.toLowerCase().includes('see') || prompt.toLowerCase().includes('vision') || prompt.toLowerCase().includes('recognize') || prompt.toLowerCase().includes('detect');
    const hasCamera = partsInWorkspace.some(p => p.type === 'Sensor' && p.realName.includes('Camera')) || partsInWorkspace.some(p => p.id === 'ultrasonic');

    const needsMotor = prompt.toLowerCase().includes('move') || prompt.toLowerCase().includes('arm') || prompt.toLowerCase().includes('drive') || prompt.toLowerCase().includes('roll');
    const hasMotor = partsInWorkspace.some(p => p.type === 'Joint');

    const hasBrain = partsInWorkspace.some(p => p.type === 'Brain');
    const hasEnergy = partsInWorkspace.some(p => p.type === 'Energy');

    await new Promise(r => setTimeout(r, 800));
    if (!hasBrain) addLog('CRITICAL: No control unit detected (Missing Brain!', 'error');
    else addLog(`Brain detected: ${partsInWorkspace.find(p => p.type === 'Brain')?.realName}`, 'success');

    await new Promise(r => setTimeout(r, 800));
    if (!hasEnergy) addLog('CRITICAL: No power source detected!', 'error');
    else addLog('Power distribution system online.', 'success');

    await new Promise(r => setTimeout(r, 800));
    if (needsMotor && !hasMotor) addLog('WARNING: Kinetic requirements not met. Missing actuators.', 'error');

    await new Promise(r => setTimeout(r, 800));
    if (needsCamera && !hasCamera) addLog('WARNING: Visual requirements not met. Missing sensory input.', 'error');

    const isSuccess = hasBrain && hasEnergy && (!needsMotor || hasMotor) && (!needsCamera || hasCamera);

    await new Promise(r => setTimeout(r, 1500));
    this.showFinalResult(isSuccess, prompt, partsInWorkspace);
  }

  private showFinalResult(success: boolean, prompt: string, parts: RobotPart[]) {
    const testView = document.getElementById('test-view')!;
    if (success) {
      testView.innerHTML = `
        <div class="result-card glass-panel success">
          <div class="animation-container">
            <div class="mini-robot-anim">🤖✨</div>
          </div>
          <h1>ASSEMBLY SUCCESSFUL</h1>
          <p>Your robot is ready for deployment. The AI has optimized the firmware for your hardware configuration.</p>
          
          <div class="code-output">
            <h3>Generated Firmware</h3>
            <pre><code>${this.generateMockCode(parts, prompt)}</code></pre>
            <div class="code-explanation">
              <h4>How it works:</h4>
              <ul>
                <li><strong>Initialization:</strong> Configures the GPIO pins on your ${parts.find(p => p.type === 'Brain')?.realName}.</li>
                <li><strong>Main Loop:</strong> Continuously checks sensors and updates motor positions based on the logic described in your prompt.</li>
                <li><strong>Exception Handling:</strong> Built-in safety checks for motor overload and low power conditions.</li>
              </ul>
            </div>
          </div>

          <div class="roadmap">
            <h3>Real-World Roadmap</h3>
            <ul>
              <li><strong>Step 1: Acquisition</strong> - Search for "${parts.find(p => p.type === 'Brain')?.realName} Datasheet" online to find the exact pinout and logic levels.</li>
              <li><strong>Step 2: Foundation</strong> - Bolt your ${parts.filter(p => p.type === 'Frame').map(p => p.realName).join(' and ') || 'custom frame'} together securely. Use M3 or M4 screws for metal rails.</li>
              <li><strong>Step 3: Actuation</strong> - Mount the ${parts.filter(p => p.type === 'Joint').map(p => p.realName).join(', ')} and ensure they have a full range of motion without binding.</li>
              <li><strong>Step 4: Energy</strong> - Connect your ${parts.find(p => p.type === 'Energy')?.realName}. ⚠️ Always double-check polarity with a multimeter before plugging in!</li>
              <li><strong>Step 5: Wiring</strong> - Use 22AWG jumper wires to connect the ${parts.filter(p => p.type === 'Sensor').map(p => p.realName).join(', ') || 'sensors'} to the brain's GPIO pins.</li>
              <li><strong>Step 6: Programming</strong> - Copy the generated firmware above and flash it using the official ${parts.find(p => p.type === 'Brain')?.type === 'Brain' ? 'IDE or CLI tools' : 'software'}.</li>
            </ul>
          </div>
          <button class="btn-primary" onclick="location.reload()">Build New Robot</button>
        </div>
      `;
    } else {
      testView.innerHTML = `
        <div class="result-card glass-panel failure">
          <h1>DIAGNOSTICS FAILED</h1>
          <p>The robot is unresponsive. Analyze the issue:</p>
          <div class="quiz-area">
            <button class="quiz-opt" data-correct="false">Software Issue (Buggy Code)</button>
            <button class="quiz-opt" data-correct="true">Hardware Issue (Missing Parts)</button>
          </div>
          <div id="quiz-feedback"></div>
          <button class="btn-secondary" onclick="location.reload()">Back to Workshop</button>
        </div>
      `;

      testView.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.getAttribute('data-correct') === 'true';
          const feedback = document.getElementById('quiz-feedback')!;
          if (isCorrect) {
            feedback.innerHTML = '<p class="log-success">Correct! The hardware anatomy is incomplete. Your robot lacks the required limbs or energy to perform its mission.</p>';
          } else {
            feedback.innerHTML = '<p class="log-error">Incorrect. The code is perfect, but the silicon cannot move without a body. Check your hardware assembly.</p>';
          }
        });
      });
    }
  }

  private generateMockCode(parts: RobotPart[], prompt: string): string {
    const brain = parts.find(p => p.type === 'Brain')?.realName || 'Controller';
    return `
# Auto-generated Firmware for THE ENGINEER
# Hardware: ${parts.map(p => p.realName).join(', ')}
# Mission: ${prompt}

import time
from dronekit import connect

def initialize_robot():
    print("Initalizing ${brain}...")
    # Setup motors and sensors
    ${parts.filter(p => p.type === 'Joint').map(p => `setup_joint("${p.realName}")`).join('\n    ')}
    
def run_loop():
    while True:
        # AI Logic for: ${prompt}
        sensor_data = read_sensors()
        if sensor_data['obstacle']:
            avoid_obstacle()
        else:
            execute_mission_step()
        time.sleep(0.1)

if __name__ == "__main__":
    initialize_robot()
    run_loop()
    `;
  }
}

new TheEngineer();
