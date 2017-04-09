var convert = require('color-convert');

const findTopColors = (state) => {
  console.log("finding top colors! ✨");

  // go through squares array, find colors, convert to HEX
  const colorsUsed = state.squares.filter((square) => (square.isSelected))
                            .map(square => square.color)
                            .map(square => convert.rgb.hex(square.r, square.g, square.b));

  // tally up the occurrences of colors
  const countedColors = colorsUsed.reduce((allColors, color) => {
    if (color in allColors) {
      allColors[color]++;
    } else {
      allColors[color] = 1;
    }
    return allColors;
  }, {});

 // sort the array by the top color
 const sortedColors = Object.keys(countedColors)
                            .sort(function(a,b){return countedColors[b]-countedColors[a]})

  // return the top 2 colors to the shirt
  if (sortedColors.length === 1) {
    return `${sortedColors[0]} ${sortedColors[0]}`;
  } else {
    return `${sortedColors[0]} ${sortedColors[1]}`;
  }
}

module.exports = findTopColors;
