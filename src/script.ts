import Crossroad from './crossroad';
import { vehicles } from './variables';
import { solve } from './solver';

// turn off for graphical prints
process.env.PRINT_GRAPHS = '1';

// init crossroad with default vehicles
const crossroad = new Crossroad([6, 6], vehicles);

solve('bfs', crossroad, 'cervene');
// solve('dfs', crossroad, 'cervene');
