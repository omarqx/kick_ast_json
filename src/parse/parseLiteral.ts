import tokenTypes  from "../tokenize/tokenTypes";
import parseString from "./parseString";


export default function parseLiteral(input, tokenList, index, settings) {
	// literal: STRING | NUMBER | TRUE | FALSE | NULL
	const token = tokenList[index];
	let value = null;

	switch (token.type) {
		case tokenTypes.STRING: {
			value = parseString(input.slice(token.loc.start.offset + 1, token.loc.end.offset - 1));
			break;
		}
		case tokenTypes.NUMBER: {
			value = Number(token.value);
			break;
		}
		case tokenTypes.TRUE: {
			value = true;
			break;
		}
		case tokenTypes.FALSE: {
			value = false;
			break;
		}
		case tokenTypes.NULL: {
			value = null;
			break;
		}
		default: {
			return null;
		}
	}

	const literal = {
		type: 'Literal',
		value,
		raw: token.value
	};
	if (settings.loc) {
        //@ts-ignore
		literal.loc = token.loc;
	}
	return {
		value: literal,
		index: index + 1
	}
}

