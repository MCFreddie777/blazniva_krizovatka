import Crossroad from './crossroad';

export enum DIRECTION {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

export interface Vehicle {
    id: number;
    name: string;
    color: (text: string) => string;
    length: number;
    polarity: 'H' | 'V';
    position: number[];
}

/* Uzol
 * previousHash - hash na predhhadzajuci uzol
 * currentState - stav
 * operator - ktory zapricinil zmenu medzi stavom predchadzajuceho uzla a aktualnym
 */
export interface State {
    previousHash: string;
    currentState: Crossroad;
    operator: Operator;
}

export interface StateMap {
    [key: string]: State;
}

export interface Operator {
    direction: string;
    vehicle: {
        id: number;
        name: string;
    };
    steps: number;
}
