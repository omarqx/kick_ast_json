import tokenize from "../tokenize";
import errorEof from "./errorEof";
import parseValue from "./parseValue";
import parseErrorTypes from "./parseErrorTypes";
import error from "../error";

const defaultSettings = {
	loc: true,
	source: null
};

export default (input, settings) => {
	settings = Object.assign({}, defaultSettings, settings);

	const tokenList = tokenize(input, settings);

	if (tokenList.length === 0) {
		errorEof(input, tokenList, settings);
	}

	const value = parseValue(input, tokenList, 0, settings);

	if (value.index === tokenList.length) {
		return value.value;
	}

	const token = tokenList[value.index];

	error(
		parseErrorTypes.unexpectedToken(
			input.substring(token.loc.start.offset, token.loc.end.offset),
			settings.source,
			token.loc.start.line,
			token.loc.start.column
		),
		input,
		settings.source,
		token.loc.start.line,
		token.loc.start.column
	);
}