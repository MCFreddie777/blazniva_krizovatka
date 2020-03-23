import chalk from 'chalk';

export const vehicles: Vehicle[] = [
    {
        id: 1,
        name: 'cervene',
        color: (text: string) => chalk.bgRed(text),
        length: 2,
        polarity: 'H',
        position: [3, 2],
    },
    {
        id: 2,
        name: 'oranzove',
        color: (text: string) => chalk.bgKeyword('orange')(text),
        length: 2,
        polarity: 'H',
        position: [1, 1],
    },
    {
        id: 3,
        name: 'zlte',
        color: (text: string) => chalk.bgYellow(text),
        length: 3,
        polarity: 'V',
        position: [2, 1],
    },
    {
        id: 4,
        name: 'fialove',
        color: (text: string) => chalk.bgKeyword('indigo')(text),
        length: 2,
        polarity: 'V',
        position: [5, 1],
    },

    {
        id: 5,
        name: 'sive',
        color: (text: string) => chalk.bgKeyword('dimgrey')(text),
        length: 2,
        polarity: 'H',
        position: [5, 5],
    },
    {
        id: 6,
        name: 'zelene',
        color: (text: string) => chalk.bgGreen(text),
        length: 3,
        polarity: 'V',
        position: [2, 4],
    },
    {
        id: 7,
        name: 'svetlomodre',
        color: (text: string) => chalk.bgBlueBright(text),
        length: 3,
        polarity: 'H',
        position: [6, 3],
    },
    {
        id: 8,
        name: 'tmavomodre',
        color: (text: string) => chalk.bgKeyword('darkblue')(text),
        length: 3,
        polarity: 'V',
        position: [1, 6],
    },
];

export interface Vehicle {
    id: number;
    name: string;
    color: (text: string) => string;
    length: number;
    polarity: 'H' | 'V';
    position: number[];
}
