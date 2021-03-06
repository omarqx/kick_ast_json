const errorStack = (new Error()).stack;

export default props => {
	// use Object.create(), because some VMs prevent setting line/column otherwise
	// (iOS Safari 10 even throws an exception)
	const error = Object.create(SyntaxError.prototype);

	Object.assign(error, props, {
		name: 'SyntaxError'
	});

	Object.defineProperty(error, 'stack', {
		get() {
			return errorStack ? errorStack.replace(/^(.+\n){1,3}/, String(error) + '\n') : '';
		}
	});

	return error;
}