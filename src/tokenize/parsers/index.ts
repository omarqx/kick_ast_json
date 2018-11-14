export {default as parseWhitespace} from "./whitespace";
import { isDigit, isDigit1to9, isExp, isHex } from "./helpers";
import tokenTypes from "../tokenTypes";

const punctuatorTokensMap = { // Lexeme: Token
	'{': tokenTypes.LEFT_BRACE,
	'}': tokenTypes.RIGHT_BRACE,
	'[': tokenTypes.LEFT_BRACKET,
	']': tokenTypes.RIGHT_BRACKET,
	':': tokenTypes.COLON,
	',': tokenTypes.COMMA
};

const keywordTokensMap = { // Lexeme: Token
	'true': tokenTypes.TRUE,
	'false': tokenTypes.FALSE,
	'null': tokenTypes.NULL
};

const stringStates = {
	_START_: 0,
	START_QUOTE_OR_CHAR: 1,
	ESCAPE: 2
};

const escapes = {
	'"': 0,		// Quotation mask
	'\\': 1,	// Reverse solidus
	'/': 2,		// Solidus
	'b': 3,		// Backspace
	'f': 4,		// Form feed
	'n': 5,		// New line
	'r': 6,		// Carriage return
	't': 7,		// Horizontal tab
	'u': 8		// 4 hexadecimal digits
};

const numberStates = {
	_START_: 0,
	MINUS: 1,
	ZERO: 2,
	DIGIT: 3,
	POINT: 4,
	DIGIT_FRACTION: 5,
	EXP: 6,
	EXP_DIGIT_OR_SIGN: 7
};

export function parseChar(input, index, line, column) {
	const char = input.charAt(index);

	if (char in punctuatorTokensMap) {
		return {
			type: punctuatorTokensMap[char],
			line,
			column: column + 1,
			index: index + 1,
			value: null
		};
	}

	return null;
}

export function parseKeyword(input, index, line, column) {
	for (const name in keywordTokensMap) {
		if (keywordTokensMap.hasOwnProperty(name) && input.substr(index, name.length) === name) {
			return {
				type: keywordTokensMap[name],
				line,
				column: column + name.length,
				index: index + name.length,
				value: name
			};
		}
	}

	return null;
}

export function parseString(input, index, line, column) {
	const startIndex = index;
	let buffer = '';
	let state = stringStates._START_;

	while (index < input.length) {
		const char = input.charAt(index);

		switch (state) {
			case stringStates._START_: {
				if (char === '"') {
					index++;
					state = stringStates.START_QUOTE_OR_CHAR;
				} else {
					return null;
				}
				break;
			}

			case stringStates.START_QUOTE_OR_CHAR: {
				if (char === '\\') {
					buffer += char;
					index++;
					state = stringStates.ESCAPE;
				} else if (char === '"') {
					index++;
					return {
						type: tokenTypes.STRING,
						line,
						column: column + index - startIndex,
						index,
						value: input.slice(startIndex, index)
					};
				} else {
					buffer += char;
					index++;
				}
				break;
			}

			case stringStates.ESCAPE: {
				if (char in escapes) {
					buffer += char;
					index++;
					if (char === 'u') {
						for (let i = 0; i < 4; i++) {
							const curChar = input.charAt(index);
							if (curChar && isHex(curChar)) {
								buffer += curChar;
								index++;
							} else {
								return null;
							}
						}
					}
					state = stringStates.START_QUOTE_OR_CHAR;
				} else {
					return null;
				}
				break;
			}
		}
	}
}

export function parseNumber(input, index, line, column) {
	const startIndex = index;
	let passedValueIndex = index;
	let state = numberStates._START_;

	iterator: while (index < input.length) {
		const char = input.charAt(index);

		switch (state) {
			case numberStates._START_: {
				if (char === '-') {
					state = numberStates.MINUS;
				} else if (char === '0') {
					passedValueIndex = index + 1;
					state = numberStates.ZERO;
				} else if (isDigit1to9(char)) {
					passedValueIndex = index + 1;
					state = numberStates.DIGIT;
				} else {
					return null;
				}
				break;
			}

			case numberStates.MINUS: {
				if (char === '0') {
					passedValueIndex = index + 1;
					state = numberStates.ZERO;
				} else if (isDigit1to9(char)) {
					passedValueIndex = index + 1;
					state = numberStates.DIGIT;
				} else {
					return null;
				}
				break;
			}

			case numberStates.ZERO: {
				if (char === '.') {
					state = numberStates.POINT;
				} else if (isExp(char)) {
					state = numberStates.EXP;
				} else {
					break iterator;
				}
				break;
			}

			case numberStates.DIGIT: {
				if (isDigit(char)) {
					passedValueIndex = index + 1;
				} else if (char === '.') {
					state = numberStates.POINT;
				} else if (isExp(char)) {
					state = numberStates.EXP;
				} else {
					break iterator;
				}
				break;
			}

			case numberStates.POINT: {
				if (isDigit(char)) {
					passedValueIndex = index + 1;
					state = numberStates.DIGIT_FRACTION;
				} else {
					break iterator;
				}
				break;
			}

			case numberStates.DIGIT_FRACTION: {
				if (isDigit(char)) {
					passedValueIndex = index + 1;
				} else if (isExp(char)) {
					state = numberStates.EXP;
				} else {
					break iterator;
				}
				break;
			}

			case numberStates.EXP: {
				if (char === '+' || char === '-') {
					state = numberStates.EXP_DIGIT_OR_SIGN;
				} else if (isDigit(char)) {
					passedValueIndex = index + 1;
					state = numberStates.EXP_DIGIT_OR_SIGN;
				} else {
					break iterator;
				}
				break;
			}

			case numberStates.EXP_DIGIT_OR_SIGN: {
				if (isDigit(char)) {
					passedValueIndex = index + 1;
				} else {
					break iterator;
				}
				break;
			}
		}

		index++;
	}

	if (passedValueIndex > 0) {
		return {
			type: tokenTypes.NUMBER,
			line,
			column: column + passedValueIndex - startIndex,
			index: passedValueIndex,
			value: input.slice(startIndex, passedValueIndex)
		};
	}

	return null;
}