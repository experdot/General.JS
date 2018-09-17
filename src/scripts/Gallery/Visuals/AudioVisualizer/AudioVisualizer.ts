import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";
import {
    DelayTimer
} from "../../../Engine/Common/DelayTimer";
import {
    FileIO
} from "../../../Engine/IO/FileIO";
import {
    GhostImageEffect
} from "../../../Engine/Game/GameComponents/Effect/Effect";
import {
    MessageBox
} from "../../../Engine/Application/MessageBox";
import {
    GameView
} from "../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../Engine/Drawing/Graphics";
import {
    OffscreenCanvas
} from "../../../Engine/Drawing/OffscreenCanvas";
import {
    InputEvents
} from "../../../Engine/Common/Inputs";
import { GalleryImages } from "../../Resources/GalleryImages";

class AudioVisualizer extends GameVisual {
    get FFTData() {
        this.audioAnalyzer.getByteFrequencyData(this.frequncyBytes);
        return this.frequncyBytes;
    }

    audio: HTMLAudioElement;
    audioSource: MediaElementAudioSourceNode;
    audioContext: AudioContext;
    audioAnalyzer: AnalyserNode;

    fftSize: number;
    frequncyBytes: Uint8Array;
    fileInfo: { name: string, playing: boolean };

    timer: DelayTimer;

    constructor() {
        super();
        this.timer = new DelayTimer();
        this.effects = {
            ghost: new GhostImageEffect(GalleryImages.Galaxy, 0.1, false),
        };
        this.joint(this.effects.ghost);
    }

    start() {
        this.initAudio();
        this.on(InputEvents.Drop, event => {
            this.loadFile(event.dataTransfer.files[0]);
        });
        this.on(InputEvents.PointerClicked, () => {
            FileIO.openFileDialog(event => {
                this.loadFile(event.target.files[0]);
            }, "audio/*");
        });
    }

    dispose() {
        super.dispose();
        this.audioContext.close();
        if (this.audio) {
            this.audio.remove();
        };
    }

    private initAudio(): void {
        this.audioContext = new AudioContext();

        this.audio = document.createElement("audio");
        this.audio.loop = true;
        document.body.appendChild(this.audio);

        this.audioSource = this.audioContext.createMediaElementSource(this.audio);
        this.audioAnalyzer = this.audioContext.createAnalyser();

        this.fftSize = this.world.width > 1200 ? 2048 : 1024;
        this.audioAnalyzer.fftSize = this.fftSize;
        this.frequncyBytes = new Uint8Array(this.audioAnalyzer.frequencyBinCount);

        this.audioSource.connect(this.audioAnalyzer);
        this.audioAnalyzer.connect(this.audioContext.destination);

        this.fileInfo = {
            name: "",
            playing: false
        };
    }

    loadFile(file: File) {
        if (file && file.type.indexOf("audio") === 0) {
            this.audio.src = URL.createObjectURL(file);
            this.audio.autoplay = true;
            this.audio.play();
            this.fileInfo.playing = true;
            this.fileInfo.name = file.name.split(".").slice(-1)[0];
        } else {
            MessageBox.show("Please select a valid audio file.");
        }
    }
}

class AudioVisualizerView extends GameView {

    innerCanvas: OffscreenCanvas;

    constructor() {
        super();
        this.rotation = 0;
        this.rotation2 = 0;
    }

    render(source, context: CanvasRenderingContext2D) {
        if (!this.innerCanvas) {
            this.innerCanvas = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }
        this.innerCanvas.draw(innerContext => {
            this.drawDynamic(source, innerContext);
        }).output(context, 0, 0);

        this.drawStatic(source, context);
    }

    drawDynamic(source, context: CanvasRenderingContext2D) {
        let w = source.world.width;
        let h = source.world.height;
        let cx = w / 2;
        let cy = h / 2;

        let data = source.FFTData;
        let value = data.reduce((acc, val) => acc + val, 0) / data.length / 255;

        let scale = value * 100;

        this.rotation2 = value;

        source.effects.ghost.effect(context);

        if (!source.fileInfo.playing) {
            this.drawText(source, context, w, h, cx, cy);
            Graphics.mirror(context, 1, -1, 0.02, () => {
                context.drawImage(context.canvas, 0, 0);
            });
        } else {
            this.rotation += 0.001;
            Graphics.scaleOffset(context, scale, scale, 0.999);
            Graphics.rotate(context, this.rotation + value, 1, () => {
                this.drawFFT(source, context, w, h, cx, cy, 1 + value * 10);
            });
            Graphics.rotate(context, Math.PI / 6, 1, () => {
                context.drawImage(context.canvas, 0, 0, w, h);
            });
            Graphics.mirror(context, -1, -1, 0.6, () => {
                context.drawImage(context.canvas, 0, 0);
            });
        }
    }

    drawText(source, context: CanvasRenderingContext2D, w, h, cx, cy) {
        let size = Math.max(w / 30, 32);
        context.font = size + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText("Drag an audio file here.", cx, cy - size / 2.5);
        context.fillRect(0, cy - 2, w, 4);
    }

    drawFFT(source, context: CanvasRenderingContext2D, w, h, cx, cy, lineScale = 1) {
        let data = source.FFTData;
        let min = Math.min(w, h) / 2;
        context.beginPath();
        for (let index = 0; index < data.length; index++) {
            let value = data[index];
            let x = index / data.length * min + min;
            let y = cy + value + Math.sin(x / (100 + Math.sin(this.rotation2) * 50)) * 100;
            context.lineTo(x, y);
        }
        context.lineWidth = w / data.length * lineScale;
        context.strokeStyle = "#FFFFFF";
        context.stroke();
    }

    drawStatic(source, context: CanvasRenderingContext2D) {
        let w = source.world.width;
        let h = source.world.height;
        this.drawFileinfo(source, context, w, h);
    }

    drawFileinfo(source, context: CanvasRenderingContext2D, w, h) {
        let fileInfo = source.fileInfo;
        if (fileInfo.playing) {
            let size = Math.max(w / 48, 16);
            let x = w * 0.1;
            let y = h * 0.8;
            context.font = size + "px Arial";
            context.textAlign = "left";
            context.fillStyle = "#FFF";
            context.fillText(fileInfo.name, x, y);

            let width = w * 0.8;
            let progress = source.audio.currentTime / source.audio.duration;
            context.strokeStyle = "#FFF";
            context.strokeRect(x, y + size, width, size / 3);
            context.fillRect(x, y + size, width * progress, size / 3);
        }
    }
}

export {
    AudioVisualizer,
    AudioVisualizerView
};