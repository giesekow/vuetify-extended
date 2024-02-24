export const $v = {
  isRequired() {
    return (va: any) => {
      if (Array.isArray(va)) {
        return va.length > 0 || 'Field is required!';
      }
      if (va || va === 0 || va === false) {
        return true;
      } else {
        return 'Field is required!';
      }
    }
  },
  range(mi: any, ma: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];

      if (Array.isArray(va)) {
        vc = [...va];
      } else {
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
    }
  },
  max(m: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) <= converter(m)) || Number(vc[i]) <= Number(m)))) {
          return `Value cannot exceed ${m}`;
        }
      }
      return true;
    }
  },
  min(m: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) >= converter(m)) || Number(vc[i]) >= Number(m)))) {
          return `Value cannot be below ${m}`;
        }
      }
      return true;
    }
  },
  gt(m: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) > converter(m)) || Number(vc[i]) > Number(m)))) {
          return `Value should be greater than ${m}`;
        }
      }
      return true;
    }
  },
  lt(m: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) < converter(m)) || Number(vc[i]) < Number(m)))) {
          return `Value should be less than ${m}`;
        }
      }
      return true;
    }
  },
  gte(m: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) >= converter(m)) || Number(vc[i]) >= Number(m)))) {
          return `Value should be greater than ${m}`;
        }
      }
      return true;
    }
  },
  lte(m: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) <= converter(m)) || Number(vc[i]) <= Number(m)))) {
          return `Value should be less than ${m}`;
        }
      }
      return true;
    }
  },
  neq(m: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) !== converter(m)) || Number(vc[i]) !== Number(m)))) {
          return `Value cannot be equal to ${m}`;
        }
      }
      return true;
    }
  },
  eq(m: any, converter?: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && ((converter && converter(vc[i]) === converter(m)) || Number(vc[i]) === Number(m)))) {
          return `Value must be equal to ${m}`;
        }
      }
      return true;
    }
  },
  in(m: any[]) {
    return (va: any) => {
      let vc: any[] = []
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && m.includes(vc[i]))) {
          return `Value must be one of ${m}`;
        }
      }
      return true;
    }
  },
  nin(m: any[]) {
    return (va: any) => {
      let vc: any[] = []
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (!((vc[i] || vc[i] === 0) && !m.includes(vc[i]))) {
          return `Value must not be one of ${m}`;
        }
      }
      return true;
    }
  },
  includes(m: any) {
    return (va: any) => {
      let vc: any[] = []
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      if (!vc.includes(m)) {
        return `Values must include ${m}`
      }
      return true;
    }
  },
  excludes(m: any) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      if (vc.includes(m)) {
        return `Values must exclude ${m}`
      }
      return true;
    }
  },
  maxLen(m: number) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (vc[i] && vc[i].toString().length > m) {
          return `Maximum length should be ${m}`;
        }
      }
      return true;
    }
  },
  minLen(m: number) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        if (vc[i] && vc[i].toString().length < m) {
          return `Minimum length should be ${m}`;
        }
      }
      return true;
    }
  },
  regex(exp: string) {
    return (va: any) => {
      let vc: any[] = [];
      
      if (Array.isArray(va)) {
        vc = [...va];
      } else {
        vc = [va];
      }

      for (let i = 0; i < vc.length; i++) {
        const re = new RegExp(exp);
        const txt = vc[i] ? vc[i].toString() : ''

        if (!re.test(txt)) {
          return `Value fails regular expression test[${exp}]`;
        }
      }
      return true;
    }
  },
};