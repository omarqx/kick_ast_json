import parseLiteral from "./parseLiteral";
import parseObject from "./parseObject";
import parseArray from "./parseArray";
import error from "../error";
import parseErrorTypes from "./parseErrorTypes";

/**
 * 
 * @param input 
 * @param tokenList 
 * @param index 
 * @param settings 
 */
export default function (input, tokenList, index, settings) {
	// value: literal | object | array
	const token = tokenList[index];

	const value = (
		parseLiteral(input, tokenList, index, settings)
		|| parseObject(input, tokenList, index, settings)
		|| parseArray(input, tokenList, index, settings)
	);

	if (value) {
		return value;
	} else {
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
}