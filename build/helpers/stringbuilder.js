"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringBuilder = void 0;
class StringBuilder {
    constructor() {
        this.strArray = new Array();
    }
    Get(nIndex) {
        let str = null;
        if ((this.strArray.length > nIndex) && (nIndex >= 0)) {
            str = this.strArray[nIndex];
        }
        return (str);
    }
    IsEmpty() {
        if (this.strArray.length == 0)
            return true;
        return (false);
    }
    Append(str) {
        if (str != null)
            this.strArray.push(str);
    }
    ToString() {
        let str = this.strArray.join("");
        return (str);
    }
    ToArrayString(delimeter) {
        let str = this.strArray.join(delimeter);
        return (str);
    }
    Clear() {
        this.strArray.length = 0;
    }
}
exports.StringBuilder = StringBuilder;
