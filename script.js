const date = new Date()
const hours = date.getHours()
const minutes = date.getMinutes()
const seconds = date.getSeconds()

const emptyGrid = (rows, columns, character) => [...Array(rows)]
  .map(() => Array(columns)
    .fill(character))



console.log(emptyGrid(51, 51, ' '));
//some ideas to make this work...
//I could create three two dimentional arrays, one for each hand of the clock
//Each 2d array coorisponds to the grid of ascii characters, and contains 60
//possible positions
//this arrays are then "merged" to a single 2d array which is then printed to 
//the screen. This would mean I only need to make 60 permutations, rather than
//86,400. 
//If I can figure out how to math, I could also programatically fill each array
//using angles
//The math is called Bresenham's line algorithm which is THE raster line algo
//I will use a raster circle algo that draws from the center point, this way 
//I can supply a constant coord for the center of the circle, as well as the 
//starting point for each clock hand
