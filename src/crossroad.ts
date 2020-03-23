import chalk from 'chalk';
const log = (text: string) => process.stdout.write(text);

import { ENTITIES } from './variables';
import { Vehicle, vehicles } from './vehicles';

export default class Crossroad {

	public array: Array<string[]>;
    public size: size;

    constructor(size: number[], exits: Array<{ i: number; j: number }>, vehicles: Vehicle[]) {

    	// init size
        this.size = {
            m: size[0] + 2,
            n: size[1] + 2,
        };

        // init array & set borders
        this.array = [];
        for (let i = 0; i < this.size.m; i++) {
            this.array.push([]);
            for (let j = 0; j < this.size.n; j++) {
                if (i === 0 || j === 0 || i == this.size.m - 1 || j == this.size.n - 1)
                    this.array[i].push(ENTITIES.WALL);
                else this.array[i].push(ENTITIES.FREE);
            }
        }

        // set exits
        exits.forEach(exit => {
            this.array[exit.i][exit.j] = ENTITIES.EXIT;
        });

        // place vehicles
        vehicles.forEach(vehicle => {
            this.array[vehicle.position[0]][vehicle.position[1]] = String(vehicle.id);

            const start = vehicle.polarity != 'V';
            for (
                let i = vehicle.position[+start];
                i < vehicle.position[+start] + vehicle.length;
                i++
            ) {
                if (vehicle.polarity == 'V') {
                    this.array[i][vehicle.position[+!start]] = String(vehicle.id);
                } else {
                    this.array[vehicle.position[+!start]][i] = String(vehicle.id);
                }
            }
        });
    }

    print() {
        Array(this.size.m)
            .fill(0)
            .forEach((_item, index) => {
                log(JSON.stringify(this.array[index]));
            });
    }

    prettyPrint(silent: boolean = false) {
        for (let i = 0; i < this.size.m; i++) {
            for (let j = 0; j < this.size.n; j++) {
                let color = undefined;
                const element = this.array[i][j];

                if (['E', '0'].includes(element)) color = chalk.reset;
                else if (element == 'B') color = chalk.bgGrey;
                else {
                    const curr = vehicles.find(vehicle => vehicle.id == +element);
                    if (curr) {
                        color = curr.color;
                    } else color = chalk.reset;
                }
                log(color(` ${silent ? ' ' : element} `));
            }
            log('\n');
        }
    }
}

interface size {
    m: number;
    n: number;
}
