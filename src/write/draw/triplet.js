var sprintf = require('./sprintf');
var renderText = require('./text');
var printPath = require('./print-path');

function drawTriplet(renderer, params) {
	var xTextPos;
	renderer.controller.currentAbsEl = { tuneNumber: renderer.controller.engraver.tuneNumber, elemset: [], abcelem: { el_type: "triplet", startChar: -1, endChar: -1 }};
	renderer.createElemSet({ klass: renderer.controller.classes.generate('triplet '+params.durationClass)});
	if (params.hasBeam) {
		var left = params.anchor1.parent.beam.isAbove() ? params.anchor1.x + params.anchor1.w : params.anchor1.x;
		xTextPos = params.anchor1.parent.beam.xAtMidpoint(left, params.anchor2.x);
	} else {
		xTextPos = params.anchor1.x + (params.anchor2.x + params.anchor2.w - params.anchor1.x) / 2;
		drawBracket(renderer, params.anchor1.x, params.startNote, params.anchor2.x + params.anchor2.w, params.endNote);
	}
	renderText(renderer, {x: xTextPos, y: renderer.calcY(params.yTextPos), text: "" + params.number, type: 'tripletfont', anchor: "middle", centerVertically: true, history: 'ignore', noClass: true});
	var g = renderer.closeElemSet();
	renderer.controller.currentAbsEl.elemset.push(g);
	renderer.controller.recordHistory(g, true);
	return g;
}

function drawLine(l, t, r, b) {
	return sprintf("M %f %f L %f %f", l, t, r, b);
}

function drawBracket(renderer, x1, y1, x2, y2) {
	y1 = renderer.calcY(y1);
	y2 = renderer.calcY(y2);
	var bracketHeight = 5;

	// Draw vertical lines at the beginning and end
	var pathString = "";
	pathString += drawLine(x1, y1, x1, y1 + bracketHeight);
	pathString += drawLine(x2, y2, x2, y2 + bracketHeight);

	// figure out midpoints to draw the broken line.
	var midX = x1 + (x2-x1)/2;
	//var midY = y1 + (y2-y1)/2;
	var gapWidth = 8;
	var slope = (y2 - y1) / (x2 - x1);
	var leftEndX = midX - gapWidth;
	var leftEndY = y1 + (leftEndX - x1) * slope;
	pathString += drawLine( x1, y1, leftEndX, leftEndY);
	var rightStartX = midX + gapWidth;
	var rightStartY = y1 + (rightStartX - x1) * slope;
	pathString += drawLine( rightStartX, rightStartY, x2, y2);
	printPath(renderer, {path: pathString, stroke: "#000000"});
}

module.exports = drawTriplet;