export const MAX_DECIMAL_PLACES = 100;
function expandNumberExponent(value) {
    const source = value.toString();
    const match = /^(-?)(\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/.exec(source);
    if (!match) {
        return source;
    }
    const sign = match[1];
    const integer = match[2];
    const fraction = match[3] || '';
    const exponent = parseInt(match[4], 10);
    const digits = `${integer}${fraction}`;
    const decimalIndex = integer.length + exponent;
    if (decimalIndex <= 0) {
        return `${sign}0.${'0'.repeat(-decimalIndex)}${digits}`;
    }
    if (decimalIndex >= digits.length) {
        return `${sign}${digits}${'0'.repeat(decimalIndex - digits.length)}`;
    }
    return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}
function decimalSource(value) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? expandNumberExponent(value) : value.toString();
    }
    if (value && typeof value === 'object' && !Array.isArray(value) && value.$numberDecimal !== undefined) {
        return String(value.$numberDecimal).trim();
    }
    return String(value !== null && value !== void 0 ? value : '').trim();
}
function incrementDigits(value) {
    const digits = value.split('');
    let carry = 1;
    for (let index = digits.length - 1; index >= 0 && carry; index -= 1) {
        if (digits[index] === '9') {
            digits[index] = '0';
        }
        else {
            digits[index] = String.fromCharCode(digits[index].charCodeAt(0) + 1);
            carry = 0;
        }
    }
    return `${carry ? '1' : ''}${digits.join('')}`;
}
export function resolveDecimalPlaces(value) {
    if (value === undefined || value === null) {
        return 2;
    }
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > MAX_DECIMAL_PLACES) {
        throw new RangeError(`decimalPlaces must be an integer between 0 and ${MAX_DECIMAL_PLACES}.`);
    }
    return value;
}
export function parseExactDecimal(value) {
    var _a, _b;
    const source = decimalSource(value);
    const match = /^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))$/.exec(source);
    if (!match) {
        return undefined;
    }
    const integer = (match[2] || '0').replace(/^0+(?=\d)/, '');
    const fraction = (_b = (_a = match[3]) !== null && _a !== void 0 ? _a : match[4]) !== null && _b !== void 0 ? _b : '';
    const negative = match[1] === '-' && /[1-9]/.test(`${integer}${fraction}`);
    const normalized = `${negative ? '-' : ''}${integer}${fraction ? `.${fraction}` : ''}`;
    return { negative, integer, fraction, normalized };
}
export function normalizeExactDecimal(value, decimalPlaces) {
    const source = decimalSource(value);
    const places = resolveDecimalPlaces(decimalPlaces);
    if (!source) {
        return { value: '', valid: true, empty: true, exceedsScale: false, scale: 0 };
    }
    const parsed = parseExactDecimal(value);
    if (!parsed) {
        return { value: source, valid: false, empty: false, exceedsScale: false, scale: 0 };
    }
    const exceedsScale = parsed.fraction.length > places;
    if (exceedsScale) {
        return {
            value: parsed.normalized,
            valid: true,
            empty: false,
            exceedsScale: true,
            scale: parsed.fraction.length,
        };
    }
    const fraction = parsed.fraction.padEnd(places, '0');
    return {
        value: `${parsed.negative ? '-' : ''}${parsed.integer}${places > 0 ? `.${fraction}` : ''}`,
        valid: true,
        empty: false,
        exceedsScale: false,
        scale: parsed.fraction.length,
    };
}
export function roundExactDecimal(value, decimalPlaces) {
    const places = resolveDecimalPlaces(decimalPlaces);
    const normalized = normalizeExactDecimal(value, places);
    if (!normalized.valid || normalized.empty || !normalized.exceedsScale) {
        return normalized;
    }
    const parsed = parseExactDecimal(value);
    let integer = parsed.integer;
    let fraction = parsed.fraction.slice(0, places);
    if (parsed.fraction.charAt(places) >= '5') {
        const incremented = incrementDigits(`${integer}${fraction}`);
        const integerLength = incremented.length - places;
        integer = incremented.slice(0, integerLength) || '0';
        fraction = places > 0 ? incremented.slice(integerLength).padStart(places, '0') : '';
    }
    const negative = parsed.negative && /[1-9]/.test(`${integer}${fraction}`);
    return {
        value: `${negative ? '-' : ''}${integer}${places > 0 ? `.${fraction.padEnd(places, '0')}` : ''}`,
        valid: true,
        empty: false,
        exceedsScale: false,
        scale: places,
    };
}
export function compareExactDecimals(left, right) {
    const a = parseExactDecimal(left);
    const b = parseExactDecimal(right);
    if (!a || !b) {
        return undefined;
    }
    if (a.negative !== b.negative) {
        return a.negative ? -1 : 1;
    }
    let magnitude = 0;
    if (a.integer.length !== b.integer.length) {
        magnitude = a.integer.length < b.integer.length ? -1 : 1;
    }
    else if (a.integer !== b.integer) {
        magnitude = a.integer < b.integer ? -1 : 1;
    }
    else {
        const scale = Math.max(a.fraction.length, b.fraction.length);
        const aFraction = a.fraction.padEnd(scale, '0');
        const bFraction = b.fraction.padEnd(scale, '0');
        if (aFraction !== bFraction) {
            magnitude = aFraction < bFraction ? -1 : 1;
        }
    }
    return a.negative ? -magnitude : magnitude;
}
