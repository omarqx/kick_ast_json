import tokenTypes from '../tokenize/tokenTypes';
import location from "../location";
import errorEof from "./errorEOF";
import error from "../error";
import parseErrorTypes from "./parseErrorTypes";
import parseProperty from "./parseProperty";

enum objectStates {
	_START_= 0,
	OPEN_OBJECT= 1,
	PROPERTY= 2,
	COMMA= 3
};

export default function parseObject(input, tokenList, index, settings) {
	// object: LEFT_BRACE (property (COMMA property)*)? RIGHT_BRACE
	let startToken;
	const object = {
		type: 'Object',
		children: []
	};
	let state = objectStates._START_;

	while (index < tokenList.length) {
		const token = tokenList[index];

		switch (state) {
			case objectStates._START_: {
				if (token.type === tokenTypes.LEFT_BRACE) {
					startToken = token;
					state = objectStates.OPEN_OBJECT;
					index ++;
				} else {
					return null;
				}
				break;
			}

			case objectStates.OPEN_OBJECT: {
				if (token.type === tokenTypes.RIGHT_BRACE) {
					if (settings.loc) {
                        //@ts-ignore
						object.loc = location(
							startToken.loc.start.line,
							startToken.loc.start.column,
							startToken.loc.start.offset,
							token.loc.end.line,
							token.loc.end.column,
							token.loc.end.offset,
							settings.source
						);
					}
					return {
						value: object,
						index: index + 1
					};
				} else {
					const property = parseProperty(input, tokenList, index, settings);
					object.children.push(property.value);
					state = objectStates.PROPERTY;
					index = property.index;
				}
				break;
			}

			case objectStates.PROPERTY: {
				if (token.type === tokenTypes.RIGHT_BRACE) {
					if (settings.loc) {
                        //@ts-ignore
						object.loc = location(
							startToken.loc.start.line,
							startToken.loc.start.column,
							startToken.loc.start.offset,
							token.loc.end.line,
							token.loc.end.column,
							token.loc.end.offset,
							settings.source
						);
					}
					return {
						value: object,
						index: index + 1
					};
				} else if (token.type === tokenTypes.COMMA) {
					state = objectStates.COMMA;
					index ++;
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
				break;
			}

			case objectStates.COMMA: {
				const property = parseProperty(input, tokenList, index, settings);
				if (property) {
					index = property.index;
					object.children.push(property.value);
					state = objectStates.PROPERTY;
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
				break;
			}
		}
	}

	errorEof(input, tokenList, settings);
}

