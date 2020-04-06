To be suitable for our project and for development in a typescript environment on angular,
we modified the ace-builds package a bit. Here are the changes we've made:

1. Added this css class to the ace.js file in src-noconflict in order to enable breakpoint visuals:

	.ace_gutter-cell.ace_breakpoint{
	  border-radius: 20px 0px 0px 20px;
	  box-shadow: 0px 0px 1px 1px red inset;
	}

2. Added the following declarations to the ace.d.ts file:

	screenToTextCoordinates(x, y);
	To the VirtualRenderer interface in order to calculate the click event coordinates.

	on(name: 'guttermousedown', callback: (e: Event) => void): Function;
	To the Editor interface to enable a gutter click event.