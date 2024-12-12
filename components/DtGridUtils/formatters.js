// Constants for byte units in binary (base-2) format
export const BYTE_UNITS = Object.freeze([
	'B',
	'KiB',
	'MiB',
	'GiB',
	'TiB',
	'PiB',
]);
const BYTES_IN_KIBIBYTE = 1024;
const lastElement = BYTE_UNITS.length - 1;

// Formatter function for memory sizes
export const formatMemorySize = (cell, formatterParams = {}) => {
	const bytes = cell.getValue();

	// Handle invalid input
	if (bytes === null || bytes === undefined || Number.isNaN(bytes)) {
		return '-';
	}

	// Handle zero bytes
	if (bytes === 0) {
		return '0 B';
	}

	// Get formatter parameters with defaults
	const {
		precision = 2, // Number of decimal places
		minUnit = BYTE_UNITS[0], // Minimum unit to use
		maxUnit = BYTE_UNITS[lastElement], // Maximum unit to use
		spaceBetween = true, // Whether to include space between number and unit
	} = formatterParams;

	// Find the minimum and maximum unit indices
	const minUnitIndex = Math.max(0, BYTE_UNITS.indexOf(minUnit));
	const maxUnitIndex = Math.min(lastElement, BYTE_UNITS.indexOf(maxUnit));

	// Calculate the appropriate unit
	let unitIndex = Math.floor(Math.log(bytes) / Math.log(BYTES_IN_KIBIBYTE));

	// Clamp the unit index between min and max
	unitIndex = Math.min(maxUnitIndex, Math.max(minUnitIndex, unitIndex));

	// Calculate the value in the selected unit
	const value = bytes / BYTES_IN_KIBIBYTE ** unitIndex;

	// Format the number with specified precision
	const formattedValue = value.toFixed(precision);

	// Remove trailing zeros after decimal point
	const trimmedValue = formattedValue.replace(/\.?0+$/, '');

	// Return formatted string with or without space
	return spaceBetween
		? `${trimmedValue} ${BYTE_UNITS[unitIndex]}`
		: `${trimmedValue}${BYTE_UNITS[unitIndex]}`;
};

// Float formatter function with configurable options
export const formatFloat = (cell, formatterParams = {}) => {
	const value = cell.getValue();

	// Handle invalid input
	if (value === null || value === undefined || Number.isNaN(value)) {
		return formatterParams.invalidPlaceholder || '';
	}

	// Get formatter parameters with defaults
	const {
		precision = 2, // Number of decimal places
		thousandSeparator = ',', // Character for thousands separator
		decimalSeparator = '.', // Character for decimal separator
		prefix = '', // String to prepend
		suffix = '', // String to append
		padZeros = false, // Whether to pad with zeros to match precision
		stripTrailingZeros = true, // Whether to remove trailing zeros
		minValue = null, // Minimum value to display (null for no minimum)
		maxValue = null, // Maximum value to display (null for no maximum)
		roundingMode = 'round', // 'round', 'floor', or 'ceil'
	} = formatterParams;

	// Clamp value if min/max are specified
	let clampedValue = value;
	if (minValue !== null) clampedValue = Math.max(clampedValue, minValue);
	if (maxValue !== null) clampedValue = Math.min(clampedValue, maxValue);

	// Apply rounding based on specified mode and precision
	let roundedValue;
	const multiplier = 10 ** precision;
	switch (roundingMode) {
		case 'floor':
			roundedValue = Math.floor(clampedValue * multiplier) / multiplier;
			break;
		case 'ceil':
			roundedValue = Math.ceil(clampedValue * multiplier) / multiplier;
			break;
		// case 'round':
		default:
			roundedValue = Math.round(clampedValue * multiplier) / multiplier;
	}

	// Convert to string with fixed precision
	let formattedValue = roundedValue.toFixed(precision);

	// Strip trailing zeros if requested and there's a decimal part
	if (stripTrailingZeros && !padZeros && formattedValue.includes('.')) {
		formattedValue = formattedValue.replace(/\.?0+$/, '');
	}

	// Split into integer and decimal parts
	const [integerPart, decimalPart] = formattedValue.split('.');

	// Add thousand separators to integer part
	const formattedIntegerPart = integerPart.replace(
		/\B(?=(\d{3})+(?!\d))/g,
		thousandSeparator,
	);

	// Combine parts with appropriate separators
	let result = formattedIntegerPart;
	if (decimalPart !== undefined) {
		result += decimalSeparator + decimalPart;
	}

	// Add prefix and suffix
	return `${prefix}${result}${suffix}`;
};
