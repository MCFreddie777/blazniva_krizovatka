import Crossroad from './crossroad';
import { Vehicle, DIRECTION, StateMap, Operator, State } from './types';
import { directions, vehicles } from './variables';
import md5 from 'md5';
import chalk from 'chalk';

export const solve = (algorithm: 'dfs' | 'bfs', crossroad: Crossroad, target: string): void => {
    // find the car name and set it as target
    const targetCar = vehicles.find(vehicle => vehicle.name == target);
    if (!targetCar) throw new Error('Auto takej farby neexistuje!');

    crossroad.setExit(targetCar.position[0]);
    crossroad.prettyPrint(true);

    const queue: Crossroad[] = [];
    const visitedStates: StateMap = {};
    // starting state
    queue.push(crossroad);

    while (queue.length != 0) {
        const state = queue.shift()!;
        // for each vehicle and for each direction
        state.vehicles.forEach((vehicle: Vehicle) => {
            directions.forEach((direction: DIRECTION) => {
                // try to move the vehicle in that direction
                const movedState = state.move(direction, state, vehicle, 1);
                if (!movedState) return;

                // check whether this state wasn't checked previously
                const hash = md5(JSON.stringify(movedState));
                if (visitedStates[hash]) return;

                visitedStates[hash] = toStateObject(state, movedState, direction, vehicle);

                // check if our target isn't in the final state
                if (vehicle.id == targetCar.id && movedState.vehicleExits(vehicle.id)) {
                    printOperators(visitedStates, md5(JSON.stringify(crossroad)), hash);
                    process.exit();
                }

                // push new state into the queue (prepend vs append - depends on algorithm)
                algorithm == 'dfs' ? queue.unshift(movedState) : queue.push(movedState);
            });
        });
    }
    console.log(chalk.red('Hlavolam nema riesenie.'));
    process.exit(1);
};

/**
 * Function which takes hashmap of states and starts from the endHash
 * Gets all the states all the way to the root
 * Checks for duplicates in same direction and merges them
 *
 * @param states
 * @param startHash
 * @param endHash - the last node
 */
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

    // Print all the operators in reverse
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

/**
 * Helper function which parses
 * the previous state, currentstate, direction and vehicle
 * into State object
 *
 * @param previousState
 * @param currentState
 * @param direction
 * @param vehicle
 * @return State
 */
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
