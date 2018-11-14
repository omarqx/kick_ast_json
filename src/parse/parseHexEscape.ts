/** @param hexCode {string} hexCode without '\u' prefix */
export default function parseHexEscape(hexCode) {
	let charCode = 0;

	for (let i = 0; i < 4; i ++) {
		charCode = charCode * 16 + parseInt(hexCode[i], 16);
	}

	return String.fromCharCode(charCode);
}