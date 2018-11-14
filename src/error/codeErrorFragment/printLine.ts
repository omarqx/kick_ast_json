import { repeat, padStart } from "lodash";
import defaultSettings from "./defaultSettings";

/**
 * print the location of the error in a code line.
 * 
 * @param line the line to display the error at.
 * @param position where in the line the error has happened
 * @param maxNumLength 
 * @param settings 
 */
export default function (line: string, position: number, maxNumLength: number, settings: { tabSize: number, extraLines: number } | undefined = defaultSettings) {
    const num = String(position);
    const formattedNum = padStart(num, maxNumLength);
    const tabReplacement = repeat(' ', settings.tabSize);

    return formattedNum + ' | ' + line.replace(/\t/g, tabReplacement);
}