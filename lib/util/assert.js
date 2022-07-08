"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonNull = void 0;
const nonNull = (obj, msg) => {
    if (!obj) {
        throw new Error(msg);
    }
    return obj;
};
exports.nonNull = nonNull;
