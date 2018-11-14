import location from '../location';
import error from '../error';
import tokenizeErrorTypes from './tokenizeErrorTypes';
import {
	parseWhitespace,
	parseChar,
	parseKeyword,
	parseNumber,
	parseString
} from "./parsers";

export default function (input, settings) {
	let line = 1;
	let column = 1;
	let index = 0;
	const tokens = [];

	while (index < input.length) {
		const args = [input, index, line, column];
		// @ts-ignore
		const whitespace = parseWhitespace(...args);

		if (whitespace) {
			index = whitespace.index;
			line = whitespace.line;
			column = whitespace.column;
			continue;
		}

		const matched = (
			parseChar(input, index, line, column)
			|| parseKeyword(input, index, line, column)
			|| parseString(input, index, line, column)
			|| parseNumber(input, index, line, column)
		);

		if (matched) {
			const token = {
				type: matched.type,
				value: matched.value,
				loc: location(
					line,
					column,
					index,
					matched.line,
					matched.column,
					matched.index,
					settings.source
				)
			};

			tokens.push(token);
			index = matched.index;
			line = matched.line;
			column = matched.column;

		} else {
			error(
				tokenizeErrorTypes.unexpectedSymbol(input.charAt(index), settings.source, line, column),
				input,
				settings.source,
				line,
				column
			);

		}
	}

	return tokens;
}