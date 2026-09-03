import { resolveUIText } from '../ui/runtime';
function validationMessage(key, fallback, values) {
    const message = Object.assign({ key, fallback }, (values ? { values } : {}));
    return resolveUIText(message);
}
export const $v = {
    isRequired() {
        return (va) => {
            if (Array.isArray(va)) {
                return va.length > 0 || validationMessage('ve.validation.required', 'Field is required!');
            }
            if (va || va === 0 || va === false) {
                return true;
            }
            else {
                return validationMessage('ve.validation.required', 'Field is required!');
            }
        };
    },
    range(mi, ma, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) <= converter(ma)) || Number(vc[i]) <= Number(ma)))) {
                    return validationMessage('ve.validation.max', 'Value cannot exceed {max}', { max: ma });
                }
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) >= converter(mi)) || Number(vc[i]) >= Number(mi)))) {
                    return validationMessage('ve.validation.min', 'Value cannot be below {min}', { min: mi });
                }
            }
            return true;
        };
    },
    max(m, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) <= converter(m)) || Number(vc[i]) <= Number(m)))) {
                    return validationMessage('ve.validation.max', 'Value cannot exceed {max}', { max: m });
                }
            }
            return true;
        };
    },
    min(m, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) >= converter(m)) || Number(vc[i]) >= Number(m)))) {
                    return validationMessage('ve.validation.min', 'Value cannot be below {min}', { min: m });
                }
            }
            return true;
        };
    },
    gt(m, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) > converter(m)) || Number(vc[i]) > Number(m)))) {
                    return validationMessage('ve.validation.greaterThan', 'Value should be greater than {value}', { value: m });
                }
            }
            return true;
        };
    },
    lt(m, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) < converter(m)) || Number(vc[i]) < Number(m)))) {
                    return validationMessage('ve.validation.lessThan', 'Value should be less than {value}', { value: m });
                }
            }
            return true;
        };
    },
    gte(m, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) >= converter(m)) || Number(vc[i]) >= Number(m)))) {
                    return validationMessage('ve.validation.greaterThanOrEqual', 'Value should be greater than or equal to {value}', { value: m });
                }
            }
            return true;
        };
    },
    lte(m, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) <= converter(m)) || Number(vc[i]) <= Number(m)))) {
                    return validationMessage('ve.validation.lessThanOrEqual', 'Value should be less than or equal to {value}', { value: m });
                }
            }
            return true;
        };
    },
    neq(m, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) !== converter(m)) || Number(vc[i]) !== Number(m)))) {
                    return validationMessage('ve.validation.notEqual', 'Value cannot be equal to {value}', { value: m });
                }
            }
            return true;
        };
    },
    eq(m, converter) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) === converter(m)) || Number(vc[i]) === Number(m)))) {
                    return validationMessage('ve.validation.equal', 'Value must be equal to {value}', { value: m });
                }
            }
            return true;
        };
    },
    in(m) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && m.includes(vc[i]))) {
                    return validationMessage('ve.validation.oneOf', 'Value must be one of {values}', { values: m.join(', ') });
                }
            }
            return true;
        };
    },
    nin(m) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (!((vc[i] || vc[i] === 0) && !m.includes(vc[i]))) {
                    return validationMessage('ve.validation.notOneOf', 'Value must not be one of {values}', { values: m.join(', ') });
                }
            }
            return true;
        };
    },
    includes(m) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            if (!vc.includes(m)) {
                return validationMessage('ve.validation.includes', 'Values must include {value}', { value: m });
            }
            return true;
        };
    },
    excludes(m) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            if (vc.includes(m)) {
                return validationMessage('ve.validation.excludes', 'Values must exclude {value}', { value: m });
            }
            return true;
        };
    },
    maxLen(m) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (vc[i] && vc[i].toString().length > m) {
                    return validationMessage('ve.validation.maxLength', 'Maximum length should be {max}', { max: m });
                }
            }
            return true;
        };
    },
    minLen(m) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                if (vc[i] && vc[i].toString().length < m) {
                    return validationMessage('ve.validation.minLength', 'Minimum length should be {min}', { min: m });
                }
            }
            return true;
        };
    },
    regex(exp) {
        return (va) => {
            let vc = [];
            if (Array.isArray(va)) {
                vc = [...va];
            }
            else {
                vc = [va];
            }
            for (let i = 0; i < vc.length; i++) {
                const re = new RegExp(exp);
                const txt = vc[i] ? vc[i].toString() : '';
                if (!re.test(txt)) {
                    return validationMessage('ve.validation.regex', 'Value fails regular expression test [{pattern}]', { pattern: exp });
                }
            }
            return true;
        };
    },
};
