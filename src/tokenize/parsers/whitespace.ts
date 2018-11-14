export default function (input, index, line, column) {
	const char = input.charAt(index);

	if (char === '\r') { // CR (Unix)
		index++;
		line++;
		column = 1;
		if (input.charAt(index) === '\n') { // CRLF (Windows)
			index++;
		}
	} else if (char === '\n') { // LF (MacOS)
		index++;
		line++;
		column = 1;
	} else if (char === '\t' || char === ' ') {
		index++;
		column++;
	} else {
		return null;
	}

	return {
		index,
		line,
		column
	};
}