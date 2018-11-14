import printLine from "./printLine";
import defaultSettings from "./defaultSettings";

export default function (lines, start, end, maxNumLength, settings = defaultSettings) {
    return lines
        .slice(start, end)
        .map((line, i) => printLine(line, start + i + 1, maxNumLength, settings))
        .join('\n');
}