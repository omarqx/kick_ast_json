import parseHexEscape from "./parseHexEscape";

const escapes = {
	'b': '\b',	// Backspace
	'f': '\f',	// Form feed
	'n': '\n',	// New line
	'r': '\r',	// Carriage return
	't': '\t'	// Horizontal tab
};

const passEscapes = ['"', '\\', '/'];

/** @param {string} string */
export default function (string) {
	let result = '';

	for (let i = 0; i < string.length; i ++) {
		const char = string.charAt(i);

		if (char === '\\') {
			i ++;
			const nextChar = string.charAt(i);
			if (nextChar === 'u') {
				result += parseHexEscape(string.substr(i + 1, 4));
				i += 4;
			} else if (passEscapes.indexOf(nextChar) !== -1) {
				result += nextChar;
			} else if (nextChar in escapes) {
				result += escapes[nextChar];
			} else {
				break;
			}
		} else {
			result += char;
		}
	}

	return result;
}

