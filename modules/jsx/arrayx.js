import mathx from './mathx.js';

const arrayx = {
    /*keySort(...keys) {
        function standardSort(a, b) {
            return a < b ? -1 : 1;
        }

        function sortFunc(a, b, key, rest) {
            if (typeof key == 'object' && key !== null) {
                var singleSortFunc = key[1];
                key = key[0]
            } else {
                var singleSortFunc = standardSort
            }

            let findOp = String(key).match(/(?<key>.*)(?<op><|>)$/);
            if (findOp) {
                op = findOp.groups.op;
                key = findOp.groups.key;
            } else {
                var op = '<'
            }

            if (a[key] === b[key]) {
                if (rest.length) {
                    return sortFunc(a, b, rest[0], rest.slice(1, -1));
                } else {
                    return 0;
                }
            } else {
                if (op == '<') {
                    return singleSortFunc(a[key], b[key]);
                } else if (op == '>') {
                    return singleSortFunc(b[key], a[key]);
                }
            }
        }

        this.sort((a, b) => sortFunc(a, b, keys[0], keys.slice(1)));
    },*/
    randomRemove(){
        let i = mathx.randInt(this.length);
        return this.splice(i, 1)[0];
    },
    shuffle(){
        for (let i = 0; i < this.length; i++) {
            let val = this[i];
            let swap = mathx.randInt(i, this.length - 1)
            this[i] = this[swap];
            this[swap] = val;
        }
    },
};

import buildIn from './buildIn.js';
Object.defineProperty(arrayx, 'buildIn', {value: buildIn(Array.prototype)});

export default arrayx;
export {arrayx};
