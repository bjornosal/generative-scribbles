import livereload from "rollup-plugin-livereload";
import htmlTemplate from "rollup-plugin-generate-html-template";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy-assets";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
    input: "src/main.js",
    output: {
        file: "dist/bundle.js",
        format: "iife", // immediately-invoked function expression — suitable for <script> tags
        sourcemap: true,
    },
    plugins: [
        !production &&
            livereload({
                delay: 100,
            }),
        htmlTemplate({
            template: "src/template.html",
            target: "dist/index.html",
        }),
        copy({
            assets: [
                // You can include directories
                "src/assets",
                // You can also include files
                "src/external/buffer.bin",
            ],
        }),
        resolve(), // tells Rollup how to find stuff in node_modules
        commonjs(), // converts date-fns to ES modules
        production && terser(), // minify, but only in production
    ],
};
