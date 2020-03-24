import Crossroad from './crossroad';
import { DIRECTION, directions, Vehicle, vehicles } from './variables';
import md5 from 'md5';

export const solve = (algorithm: 'dfs' | 'bfs', crossroad: Crossroad, target: string): void => {
    const targetCar = vehicles.find(vehicle => vehicle.name == target);
    if (!targetCar) throw new Error('Auto takej farby neexistuje!');

    crossroad.setExit(targetCar.position[0]);
    crossroad.prettyPrint(true);

    const queue: Crossroad[] = [];
    const visitedStates: StateMap = {};
    queue.push(crossroad);

    while (queue.length != 0) {
        const state = queue.shift()!;
        state.vehicles.forEach((vehicle: Vehicle) => {
            directions.forEach((direction: DIRECTION) => {
                const movedState = state.move(direction, state, vehicle, 1);
                if (movedState) {
                    const hash = md5(JSON.stringify(movedState));
                    if (!visitedStates[hash]) {
                        visitedStates[hash] = toStateObject(state, movedState, direction, vehicle);
                        if (vehicle.id == targetCar.id && movedState.vehicleExits(vehicle.id)) {
                            printOperators(visitedStates, md5(JSON.stringify(crossroad)), hash);
                            process.exit();
                        } else {
                            if (algorithm == 'dfs') {
                                queue.unshift(movedState);
                            } else {
                                queue.push(movedState);
                            }
                        }
                    }
                }
            });
        });
    }
};

const printOperators = (states: StateMap, startHash: string, endHash: string) => {
    const steps: Array<{ state: Crossroad; operator: Operator }> = [];

    let currentHash = endHash;
    while (currentHash != startHash) {
        // merge possible duplicates (1,1,1 => 3)
        let previousStep = steps.slice(-1)[0];
        if (
            previousStep &&
            states[currentHash].operator.direction == previousStep.operator.direction &&
            states[currentHash].operator.vehicle.id == previousStep.operator.vehicle.id
        ) {
            ++previousStep.operator.steps;
        } else {
            steps.push({
                state: states[currentHash].currentState,
                operator: states[currentHash].operator,
            });
        }
        currentHash = states[currentHash].previousHash;
    }

    const n = steps.length;
    while (steps.length > 0) {
        const step = steps.pop()!;
        console.log(
            `${step.operator.direction}(${step.operator.vehicle.name},${step.operator.steps})`
        );
        if (Number(process.env.PRINT_GRAPHS)) {
            step.state.prettyPrint(true);
        }
    }
    if (!Number(process.env.PRINT_GRAPHS)) {
        states[endHash].currentState.prettyPrint(true);
    }

    console.log(`Number of solution steps: ${n}`);
    console.log('Number of states (total): ', Object.keys(states).length);
};

const toStateObject = (
    previousState: Crossroad,
    currentState: Crossroad,
    direction: DIRECTION,
    vehicle: Vehicle
): State => ({
    previousHash: md5(JSON.stringify(previousState)),
    currentState: currentState,
    operator: {
        direction: DIRECTION[direction],
        vehicle: {
            id: vehicle.id,
            name: vehicle.name,
        },
        steps: 1,
    },
});

interface StateMap {
    [key: string]: State;
}

/* Uzol
 * previousHash - hash na predhhadzajuci uzol
 * currentState - stav
 * operator - ktory zapricinil zmenu medzi stavom predchadzajuceho uzla a aktualnym
 */
interface State {
    previousHash: string;
    currentState: Crossroad;
    operator: Operator;
}

interface Operator {
    direction: string;
    vehicle: {
        id: number;
        name: string;
    };
    steps: number;
}
