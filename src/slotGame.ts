import { Application, Container, Graphics } from 'pixi.js';
import { REEL_CONFIG } from './ui/ui_constants';

export class slotGame {
    private app: Application;
    private reelContainer!: Container;
    private symbolHeight = REEL_CONFIG.symbolHeight;
    private reelWidth = REEL_CONFIG.reelWidth;
    private symbols: Graphics[] = [];
    private isSpinning = false;
    private spinSpeed = REEL_CONFIG.spinSpeed; // Speed at which symbols move downwards

    constructor() {
        this.app = new Application();
    }

    public async init() {
        await this.app.init({ width: 800, height: 600, backgroundColor: 0x1a052e });
        document.body.appendChild(this.app.canvas);

        this.setupReelDisplay();
        this.createMascotPlaceholder();
        
        // Start engine loop
        this.app.ticker.add((ticker) => this.update(ticker.deltaTime));

        // Start spinning automatically after 1 second to showcase animation
        setTimeout(() => this.startSpin(), 1000);
    }

    private setupReelDisplay() {
        this.reelContainer = new Container();
        this.reelContainer.x = 325;
        this.reelContainer.y = 100;
        this.app.stage.addChild(this.reelContainer);

        // Generate 4 colorful placeholders for symbols
        const colors = [0xff0055, 0x00ffcc, 0xffcc00, 0x9900ff];
        for (let i = 0; i < 4; i++) {
            const symbol = new Graphics()
                .rect(10, 10, this.reelWidth - 20, this.symbolHeight - 20)
                .fill(colors[i]);
            symbol.y = i * this.symbolHeight;
            this.reelContainer.addChild(symbol);
            this.symbols.push(symbol);
        }

        // Apply visual mask window
        const reelMask = new Graphics()
            .rect(0, 0, this.reelWidth, this.symbolHeight * 3)
            .fill(0xffffff);
            
        this.reelContainer.addChild(reelMask);
        this.reelContainer.mask = reelMask;
    }

    private createMascotPlaceholder() {
        // Draw a placeholder triangle for your uimascot
        const mascot = new Graphics()
            .poly([0, 100, 50, 0, 100, 100])
            .fill(0x00ff00);
        mascot.x = 80;
        mascot.y = 200;
        this.app.stage.addChild(mascot);
    }

    public startSpin() {
        this.isSpinning = true;
    }

    private update(deltaTime: number) {
        if (!this.isSpinning) return;

        // Animate symbols downwards at high speed
        this.symbols.forEach(symbol => {
            symbol.y += this.spinSpeed * deltaTime;

            // Loop symbols around when they escape out the bottom edge
            if (symbol.y >= this.symbolHeight * 3) {
                symbol.y -= this.symbolHeight * 4;
            }
        });
    }
}
