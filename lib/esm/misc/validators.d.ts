export declare const $v: {
    isRequired(): (va: any) => true | "Field is required!";
    range(mi: any, ma: any, converter?: any): (va: any) => string | true;
    max(m: any, converter?: any): (va: any) => string | true;
    min(m: any, converter?: any): (va: any) => string | true;
    gt(m: any, converter?: any): (va: any) => string | true;
    lt(m: any, converter?: any): (va: any) => string | true;
    gte(m: any, converter?: any): (va: any) => string | true;
    lte(m: any, converter?: any): (va: any) => string | true;
    neq(m: any, converter?: any): (va: any) => string | true;
    eq(m: any, converter?: any): (va: any) => string | true;
    in(m: any[]): (va: any) => string | true;
    nin(m: any[]): (va: any) => string | true;
    includes(m: any): (va: any) => string | true;
    excludes(m: any): (va: any) => string | true;
    maxLen(m: number): (va: any) => string | true;
    minLen(m: number): (va: any) => string | true;
    regex(exp: string): (va: any) => string | true;
};
