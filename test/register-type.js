'use strict';

const expect = require('chai').expect,
    props = require('../');

describe('Register new type', function() {
    it('New type should validate: name, func', () => {
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

        expect(() => newTypeValidator.validate({myPony: 'Apple Jack'}, {myPony: 'pony'})).to.not.throw();
    });

    it('New type should validate: named func', () => {
        const newTypeValidator = props.create().registerType(function pokemon(value) {
            const pokemon_list = [
                'Pikachu',
                'Bulbasaur',
                'Squirtle',
                'Charmander',
            ];

            return pokemon_list.find(pokeii => pokeii === value);

        });
        expect(() => newTypeValidator.validate({myPoke: 'Bulbasaur'}, {myPoke: 'pokemon'})).to.not.throw();
    });

    it('New types should validate: array', () => {
        const newTypes = [
            function puppies(value) {
                return ['Spot', 'Rover', 'Max'].find(puppy => puppy === value);
            },
            function kittens(value) {
                return ['Snowball', 'Whiskers', 'Mr. Cat'].find(kitty => kitty === value);

            },
        ];

        const newTypeValidator = props.create().registerType(newTypes);

        expect(() => newTypeValidator.validate({myPup: 'Rover'}, {myPup: 'puppies'})).to.not.throw();
        expect(() => newTypeValidator.validate({myKit: 'Mr. Cat'}, {myKit: 'kittens'})).to.not.throw();
    });
});
