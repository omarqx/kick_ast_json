import { repeat } from "lodash";
import printLine from "./printLine";
import printLines from "./printLines";
import defaultSettings from "./defaultSettings";


export default (input, linePos, columnPos, settings = defaultSettings) => {
    settings = Object.assign({}, defaultSettings, settings);

    const lines = input.split(/\r\n?|\n|\f/);
    const startLinePos = Math.max(1, linePos - settings.extraLines) - 1;
    const endLinePos = Math.min(linePos + settings.extraLines, lines.length);
    const maxNumLength = String(endLinePos).length;
    const prevLines = printLines(lines, startLinePos, linePos, maxNumLength, settings);
    const targetLineBeforeCursor = printLine(lines[linePos - 1].substring(0, columnPos - 1), linePos, maxNumLength, settings);
    const cursorLine = repeat(' ', targetLineBeforeCursor.length) + '^';
    const nextLines = printLines(lines, linePos, endLinePos, maxNumLength, settings);

    return [prevLines, cursorLine, nextLines]
        .filter(Boolean)
        .join('\n');
}