'use strict';

const self = module.exports;

self.all = {
    myString: 'puppy',
    myNumber: 42,
    myArray: ['who', 'what', 'where', 'when', 'why'],
    myTypedArray: [24, 13, 30, 1337],
    myObject: {
        spam: 'eggs'
    },
    myDate: new Date(),
    myTrue: true,
    myFalse: false,
    myCustom: 'Twilight Sparkle',
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
    myDate: new Date()
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
    myTypedArray: [new Date()],
};

self.invalidObject = {
    myObject: 'Flutter Shy',
};

self.invalidDate = {
    myDate: '13/13/13'
};

self.invalidTrue = {
    myTrue: 'foo'
};

self.invalidFalse = {
    myFalse: -1
};
