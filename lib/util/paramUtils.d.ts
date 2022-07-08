export declare const getRequestExtraParam: (url?: string) => Map<string, string> | null;
export declare const existExtraParam: (url: string, param: string) => boolean;
export declare const isWanted: (wanted: unknown, value?: unknown) => boolean;
export declare const appendParam: (url: string, key: string, value: string) => string;
