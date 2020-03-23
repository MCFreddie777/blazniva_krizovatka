import chalk from "chalk";

export const vehicles: Vehicle[] = [
	{
		id: 1,
		name: "oranzove",
		color: (text: string) => chalk.bgKeyword("orange")(text),
		length: 2,
		polarity: "H"
	},
	{
		id: 2,
		name: "zlte",
		color: (text: string) => chalk.bgYellow(text),
		length: 3,
		polarity: "V"
	},
	{
		id: 3,
		name: "ruzove",
		color: (text: string) => chalk.bgKeyword("hotpink")(text),
		length: 2,
		polarity: "V"
	},
	{
		id: 4,
		name: "cervene",
		color: (text: string) => chalk.bgRed(text),
		length: 2,
		polarity: "H"
	},
	{
		id: 5,
		name: "zelene",
		color: (text: string) => chalk.bgGreenBright(text),
		length: 3,
		polarity: "V"
	},
	{
		id: 6,
		name: "svetlomodre",
		color: (text: string) => chalk.bgBlueBright(text),
		length: 3,
		polarity: "H"
	},
	{
		id: 7,
		name: "sive",
		color: (text: string) => chalk.bgKeyword('dimgrey')(text),
		length: 2,
		polarity: "H"
	},
	{
		id: 8,
		name: "fialove",
		color: (text: string) => chalk.bgKeyword('indigo')(text),
		length: 3,
		polarity: "V"
	}
];

export const positions: VehiclePosition[] = [
	{
		position: [0, 0],
		id: 1
	},
	{
		position: [1, 0],
		id: 2
	},
	{
		position: [4, 0],
		id: 3
	},
	{
		position: [2, 1],
		id: 4
	},
	{
		position: [1, 3],
		id: 5
	},
	{
		position: [5, 2],
		id: 6
	},
	{
		position: [4, 4],
		id: 7
	},
	{
		position: [0, 5],
		id: 8
	}
];

export interface Vehicle {
	id: number;
	name: string;
	color: (text: string) => string;
	length: number;
	polarity: "H" | "V";
}

export interface VehiclePosition {
	position: number[];
	id: number;
}
