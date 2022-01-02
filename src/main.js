import { sketch } from "./sketch.js";
import p5 from "p5";
import { sineWave } from "./algos/sineWave.js";
import ui from "./tweakpane/ui.js";

//TODO: Set background color from tweakpane.
// document.body.style.backgroundColor = "red";

ui()
new p5(sineWave);