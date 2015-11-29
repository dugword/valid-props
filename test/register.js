'use strict';

const expect = require('chai').expect,
    props = require('../');

describe('Register new type', function() {
    it('New type should validate', () => {
        const newTypeValidator = props.create().registerType('pony', value => {
            const ponies = [
                'Twilight Sparkle',
                'Apple Jack',
                'Flutter Shy',
                'Pinkie Pie',
                'Rainbow Dash',
                'Rarity',
            ];
        return ponies.find(pony => pony === value);

        });

        newTypeValidator.validate({myPony: 'Apple Jack'}, {myPony: 'pony'});
    });
});
