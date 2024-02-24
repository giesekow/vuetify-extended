export const $v = {
    isRequired() {
        return (va) => {
            if (Array.isArray(va)) {
                return va.length > 0 || 'Field is required!';
            }
            if (va || va === 0 || va === false) {
                return true;
            }
            else {
                return 'Field is required!';
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
                    return `Value cannot exceed ${ma}`;
                }
                if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) >= converter(mi)) || Number(vc[i]) >= Number(mi)))) {
                    return `Value cannot be below ${mi}`;
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
                    return `Value cannot exceed ${m}`;
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
                    return `Value cannot be below ${m}`;
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
                    return `Value should be greater than ${m}`;
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
                    return `Value should be less than ${m}`;
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
                    return `Value should be greater than ${m}`;
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
                    return `Value should be less than ${m}`;
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
                    return `Value cannot be equal to ${m}`;
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
                    return `Value must be equal to ${m}`;
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
                    return `Value must be one of ${m}`;
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
                    return `Value must not be one of ${m}`;
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
                return `Values must include ${m}`;
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
                return `Values must exclude ${m}`;
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
                    return `Maximum length should be ${m}`;
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
                    return `Minimum length should be ${m}`;
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
                    return `Value fails regular expression test[${exp}]`;
                }
            }
            return true;
        };
    },
};
