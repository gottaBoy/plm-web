import { ValueOP } from '@ibiz-template/runtime';

export declare const FilterModeSelect: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    value: StringConstructor;
    modes: {
        (arrayLength: number): string[];
        (...items: string[]): string[];
        new (arrayLength: number): string[];
        new (...items: string[]): string[];
        isArray(arg: any): arg is any[];
        readonly prototype: any[];
        from<T>(arrayLike: ArrayLike<T>): T[];
        from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
        from<T>(iterable: Iterable<T> | ArrayLike<T>): T[];
        from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
        of<T>(...items: T[]): T[];
        fromAsync<T>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T | PromiseLike<T>> | ArrayLike<T | PromiseLike<T>>): Promise<T[]>;
        fromAsync<T, U>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>, mapFn: (value: Awaited<T>, index: number) => U, thisArg?: any): Promise<Awaited<U>[]>;
        readonly [Symbol.species]: ArrayConstructor;
    };
    disabled: BooleanConstructor;
}>, {
    availableModes: import('vue').ComputedRef<readonly [{
        readonly valueOP: ValueOP.EQ;
        readonly label: "等于(=)";
    }, {
        readonly valueOP: ValueOP.NOT_EQ;
        readonly label: "不等于(<>)";
    }, {
        readonly valueOP: ValueOP.GT;
        readonly label: "大于(>)";
    }, {
        readonly valueOP: ValueOP.GT_AND_EQ;
        readonly label: "大于等于(>=)";
    }, {
        readonly valueOP: ValueOP.LT;
        readonly label: "小于(<)";
    }, {
        readonly valueOP: ValueOP.LT_AND_EQ;
        readonly label: "小于等于(<=)";
    }, {
        readonly valueOP: ValueOP.IS_NULL;
        readonly label: "值为空(Nil)";
    }, {
        readonly valueOP: ValueOP.IS_NOT_NULL;
        readonly label: "值不为空(NotNil)";
    }, {
        readonly valueOP: ValueOP.IN;
        readonly label: "值在范围中(In)";
    }, {
        readonly valueOP: ValueOP.NOT_IN;
        readonly label: "值不在范围中(NotIn)";
    }, {
        readonly valueOP: ValueOP.LIKE;
        readonly label: "文本包含(%)";
    }, {
        readonly valueOP: ValueOP.LIFT_LIKE;
        readonly label: "文本左包含(%#)";
    }, {
        readonly valueOP: ValueOP.RIGHT_LIKE;
        readonly label: "文本右包含(#%)";
    }, {
        readonly valueOP: ValueOP.EXISTS;
        readonly label: "存在(EXISTS)";
    }, {
        readonly valueOP: ValueOP.NOT_EXISTS;
        readonly label: "不存在(NOTEXISTS)";
    }] | ({
        readonly valueOP: ValueOP.EQ;
        readonly label: "等于(=)";
    } | {
        readonly valueOP: ValueOP.NOT_EQ;
        readonly label: "不等于(<>)";
    } | {
        readonly valueOP: ValueOP.GT;
        readonly label: "大于(>)";
    } | {
        readonly valueOP: ValueOP.GT_AND_EQ;
        readonly label: "大于等于(>=)";
    } | {
        readonly valueOP: ValueOP.LT;
        readonly label: "小于(<)";
    } | {
        readonly valueOP: ValueOP.LT_AND_EQ;
        readonly label: "小于等于(<=)";
    } | {
        readonly valueOP: ValueOP.IS_NULL;
        readonly label: "值为空(Nil)";
    } | {
        readonly valueOP: ValueOP.IS_NOT_NULL;
        readonly label: "值不为空(NotNil)";
    } | {
        readonly valueOP: ValueOP.IN;
        readonly label: "值在范围中(In)";
    } | {
        readonly valueOP: ValueOP.NOT_IN;
        readonly label: "值不在范围中(NotIn)";
    } | {
        readonly valueOP: ValueOP.LIKE;
        readonly label: "文本包含(%)";
    } | {
        readonly valueOP: ValueOP.LIFT_LIKE;
        readonly label: "文本左包含(%#)";
    } | {
        readonly valueOP: ValueOP.RIGHT_LIKE;
        readonly label: "文本右包含(#%)";
    } | {
        readonly valueOP: ValueOP.EXISTS;
        readonly label: "存在(EXISTS)";
    } | {
        readonly valueOP: ValueOP.NOT_EXISTS;
        readonly label: "不存在(NOTEXISTS)";
    })[]>;
    onChange: (value: string) => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (_mode: string) => true;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    value: StringConstructor;
    modes: {
        (arrayLength: number): string[];
        (...items: string[]): string[];
        new (arrayLength: number): string[];
        new (...items: string[]): string[];
        isArray(arg: any): arg is any[];
        readonly prototype: any[];
        from<T>(arrayLike: ArrayLike<T>): T[];
        from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
        from<T>(iterable: Iterable<T> | ArrayLike<T>): T[];
        from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
        of<T>(...items: T[]): T[];
        fromAsync<T>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T | PromiseLike<T>> | ArrayLike<T | PromiseLike<T>>): Promise<T[]>;
        fromAsync<T, U>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>, mapFn: (value: Awaited<T>, index: number) => U, thisArg?: any): Promise<Awaited<U>[]>;
        readonly [Symbol.species]: ArrayConstructor;
    };
    disabled: BooleanConstructor;
}>> & Readonly<{
    onChange?: ((_mode: string) => any) | undefined;
}>, {
    disabled: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
