export function clone(v) {
	if (v === null || typeof v !== 'object') {
		return v;
	}

	const stack = [{ source: v, target: Array.isArray(v) ? [] : {} }];
	const result = stack[0].target;

	while (stack.length > 0) {
		const { source, target } = stack.pop();

		for (const key in source) {
			if (Object.hasOwn(source, key)) {
				const value = source[key];
				if (value !== null && typeof value === 'object') {
					const newTarget = Array.isArray(value) ? [] : {};
					target[key] = newTarget;
					stack.push({ source: value, target: newTarget });
				} else {
					target[key] = value;
				}
			}
		}
	}

	return result;
}

export function debounce(func, wait) {
	let timeout: ReturnType<typeof setTimeout>;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}
