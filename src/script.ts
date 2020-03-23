import Crossroad from "./crossroad";
import { positions as vehiclePositions } from "./vehicles";

const crossroad = new Crossroad([6, 6], [{ i: 3, j: 7 }], vehiclePositions);
crossroad.prettyPrint();
