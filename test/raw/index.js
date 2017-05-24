'use strict';

const self = module.exports;

self.empty = {};

self.all = {
    myString: 'puppy',
    myNumber: 42,
    myArray: ['who', 'what', 'where', 'when', 'why'],
    myTypedArray: [24, 13, 30, 1337],
    myObject: {
        spam: 'eggs'
    },
    myDate: new Date('1955-11-12'),
    myTrue: true,
    myFalse: false,
    myCustom: 'Twilight Sparkle',
    myRegExp: 'Rarity loves gems!',
    myNestedObject: {
        myNestedString: 'pony',
        myNestedNumber: 24,
        myDoubleNestedObject: {
            myDoubleNestedString: 'string',
            myDoubleNestedNumber: 13,
        }
    },
};

self.string = {
    myString: 'puppy'
};

self.number = {
    myNumber: 42
};

self.array = {
    myArray: ['who', 'what', 'where', 'when', 'why']
};

self.typedArray = {
    myTypedArray: [24, 13, 30, 1337],
};

self.object = {
    myObject: {
        spam: 'eggs'
    }
};

self.date = {
    myDate: new Date('1955-11-12'),
};

self.true = {
    myTrue: true
};

self.false = {
    myFalse: false
};

self.invalidString = {
    myString: null
};

self.invalidNumber = {
    myNumber: 'puppy'
};

self.invalidArray = {
    myArray: {
        spam: 'eggs'
    }
};

self.invalidTypedArray = {
    myTypedArray: [new Date('1955-11-12')],
};

self.invalidObject = {
    myObject: 'Flutter Shy',
};

self.invalidDate = {
    myDate: '13/13/13',
};

self.invalidTrue = {
    myTrue: 'foo',
};

self.invalidFalse = {
    myFalse: -1,
};

self.invalidCustom = {
    myCustom: 'Bulbasaur',
};

self.invalidRegExp = {
    myRegExp: 'Pikachu',
};
