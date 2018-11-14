import tokenTypes from '../tokenize/tokenTypes';
import location from "../location";
import errorEof from './errorEOF';
import parseValue from './parseValue';
import error from '../error';
import parseErrorTypes from './parseErrorTypes';

enum arrayStates {
	_START_= 0,
	OPEN_ARRAY= 1,
	VALUE= 2,
	COMMA= 3
};

export default function parseArray(input, tokenList, index, settings) {
	// array: LEFT_BRACKET (value (COMMA value)*)? RIGHT_BRACKET
	let startToken;
	const array = {
		type: 'Array',
		children: []
	};
	let state = arrayStates._START_;
	let token;

	while (index < tokenList.length) {
		token = tokenList[index];

		switch (state) {
			case arrayStates._START_: {
				if (token.type === tokenTypes.LEFT_BRACKET) {
					startToken = token;
					state = arrayStates.OPEN_ARRAY;
					index ++;
				} else {
					return null;
				}
				break;
			}

			case arrayStates.OPEN_ARRAY: {
				if (token.type === tokenTypes.RIGHT_BRACKET) {
					if (settings.loc) {
                        //@ts-ignore
						array.loc = location(
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
						value: array,
						index: index + 1
					};
				} else {
					const value = parseValue(input, tokenList, index, settings);
					index = value.index;
					array.children.push(value.value);
					state = arrayStates.VALUE;
				}
				break;
			}

			case arrayStates.VALUE: {
				if (token.type === tokenTypes.RIGHT_BRACKET) {
					if (settings.loc) {
                        //@ts-ignore
						array.loc = location(
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
						value: array,
						index: index + 1
					};
				} else if (token.type === tokenTypes.COMMA) {
					state = arrayStates.COMMA;
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

			case arrayStates.COMMA: {
				const value = parseValue(input, tokenList, index, settings);
				index = value.index;
				array.children.push(value.value);
				state = arrayStates.VALUE;
				break;
			}
		}
	}

	errorEof(input, tokenList, settings);
}