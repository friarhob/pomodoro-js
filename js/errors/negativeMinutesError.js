"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegativeMinutesError = void 0;
class NegativeMinutesError extends Error {
    constructor(m) {
        super(m);
    }
}
exports.NegativeMinutesError = NegativeMinutesError;
