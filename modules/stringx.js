const stringx = {
    toArray(){
        let array = [];
        for (let char of this) {
            array.push(char);
        }

        return array;
    },
};

import buildIn from './buildIn.js';
Object.defineProperty(stringx, 'buildIn', {value: buildIn(String.prototype)});

export default stringx;
export {stringx};