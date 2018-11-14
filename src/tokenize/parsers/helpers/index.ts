export function isDigit1to9(char) {
	return char >= '1' && char <= '9';
}

export function isDigit(char) {
	return char >= '0' && char <= '9';
}

export function isHex(char) {
	return (
		isDigit(char)
		|| (char >= 'a' && char <= 'f')
		|| (char >= 'A' && char <= 'F')
	);
}

export function isExp(char) {
	return char === 'e' || char === 'E';
}