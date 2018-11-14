import tokenTypes from '../tokenize/tokenTypes';
import error from "../error";
import parseErrorTypes from "./parseErrorTypes";
import parseValue from "./parseValue";
import location from "../location";
import parseString from "./parseString";

enum propertyStates {
	_START_= 0,
	KEY= 1,
	COLON= 2
};


export default function (input, tokenList, index, settings) {
	// property: STRING COLON value
	let startToken;
	const property = {
		type: 'Property',
		key: null,
		value: null
	};
	let state = propertyStates._START_;

	while (index < tokenList.length) {
		const token = tokenList[index];

		switch (state) {
			case propertyStates._START_: {
				if (token.type === tokenTypes.STRING) {
					const key = {
						type: 'Identifier',
						value: parseString(input.slice(token.loc.start.offset + 1, token.loc.end.offset - 1)),
						raw: token.value
					};
					if (settings.loc) {
                        //@ts-ignore
						key.loc = token.loc;
					}
					startToken = token;
					property.key = key;
					state = propertyStates.KEY;
					index ++;
				} else {
					return null;
				}
				break;
			}

			case propertyStates.KEY: {
				if (token.type === tokenTypes.COLON) {
					state = propertyStates.COLON;
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

			case propertyStates.COLON: {
				const value = parseValue(input, tokenList, index, settings);
				property.value = value.value;
				if (settings.loc) {
                    //@ts-ignore
					property.loc = location(
						startToken.loc.start.line,
						startToken.loc.start.column,
                        startToken.loc.start.offset,
                        //@ts-ignore
                        value.value.loc.end.line,
                        //@ts-ignore
                        value.value.loc.end.column,
                        //@ts-ignore
						value.value.loc.end.offset,
						settings.source
					);
				}
				return {
					value: property,
					index: value.index
				};
			}

		}
	}
}