import error from "../error";
import parseErrorTypes from "./parseErrorTypes";

export default function errorEof(input, tokenList, settings) {
	const loc = tokenList.length > 0
		? tokenList[tokenList.length - 1].loc.end
		: { line: 1, column: 1 };

	error(
		parseErrorTypes.unexpectedEnd(),
		input,
		settings.source,
		loc.line,
		loc.column
	);
}