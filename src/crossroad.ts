import chalk from 'chalk';
import { cloneDeep } from 'lodash';
import { DIRECTION, ENTITIES, Vehicle } from './variables';

const log = (text: string) => process.stdout.write(text);

export default class Crossroad {
    public array: Array<string[]>;
    public size: number[];
    public exit: number | undefined;

    constructor(size: number[], public vehicles: Vehicle[], exit?: number) {
        // init size
        this.size = size.map(n => n + 2);

        // init array & set borders
        this.array = [];
        for (let i = 0; i < this.size[0]; i++) {
            this.array.push([]);
            for (let j = 0; j < this.size[1]; j++) {
                if (i === 0 || j === 0 || i == this.size[0] - 1 || j == this.size[1] - 1)
                    this.array[i].push(ENTITIES.WALL);
                else this.array[i].push(ENTITIES.FREE);
            }
        }

        // place vehicles
        this.vehicles.forEach(vehicle => {
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

        //set exit
        if (exit) {
            this.setExit(exit);
        }
    }

    setExit(mPos: number) {
        this.exit = mPos;
        this.array[mPos][this.size[1] - 1] = ENTITIES.EXIT;
    }

    move(
        direction: DIRECTION,
        state: Crossroad,
        vehicle: Vehicle,
        steps: number
    ): Crossroad | undefined {
        if (this.canMove(vehicle, direction, steps)) {
            let vehicles: Vehicle[] = cloneDeep(this.vehicles);
            let _vehicle: Vehicle = cloneDeep(vehicles.find(v => v.id == vehicle.id))!;

            // moving
            if (_vehicle.polarity == 'V') {
                _vehicle.position[0] =
                    _vehicle.position[0] + (direction == DIRECTION.DOWN ? steps : -1 * steps);
            } else {
                _vehicle.position[1] =
                    _vehicle.position[1] + (direction == DIRECTION.RIGHT ? steps : -1 * steps);
            }

            vehicles = vehicles.map(v => (v.id == _vehicle.id ? _vehicle : v));
            return new Crossroad(this.size.map(n => n - 2), vehicles, state.exit);
        }
        return undefined;
    }

    canMove(vehicle: Vehicle, direction: DIRECTION, steps: number): boolean {
        const polarity = vehicle.polarity;
        if (
            (polarity == 'V' && (direction == DIRECTION.LEFT || direction == DIRECTION.RIGHT)) ||
            (polarity == 'H' && (direction == DIRECTION.UP || direction == DIRECTION.DOWN))
        ) {
            return false;
        } else {
            let targetPosition: string;
            if (polarity == 'V') {
                const positionX =
                    direction == DIRECTION.UP
                        ? vehicle.position[0] - steps
                        : vehicle.position[0] + (vehicle.length - 1) + steps;
                targetPosition = this.array[positionX][vehicle.position[1]];
            } else {
                const positionY =
                    direction == DIRECTION.LEFT
                        ? vehicle.position[1] - steps
                        : vehicle.position[1] + (vehicle.length - 1) + steps;
                targetPosition = this.array[vehicle.position[0]][positionY];
            }
            return targetPosition == ENTITIES.EXIT || targetPosition == ENTITIES.FREE;
        }
    }

    vehicleExits(vehicleId: number) {
        const vehicle = this.vehicles.find(v => v.id == vehicleId)!;
        return (
            this.array[vehicle.position[0]][vehicle.position[1] + vehicle.length] == ENTITIES.EXIT
        );
    }

    prettyPrint(silent: boolean = false): void {
        for (let i = 0; i < this.size[0]; i++) {
            for (let j = 0; j < this.size[1]; j++) {
                let color = undefined;
                const element = this.array[i][j];

                if (['E', '0'].includes(element)) color = chalk.reset;
                else if (element == 'B') color = chalk.bgGrey;
                else {
                    const curr = this.vehicles.find(vehicle => vehicle.id == +element);
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
