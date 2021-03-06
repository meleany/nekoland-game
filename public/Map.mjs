// 0: Free to move. 10: Boundary, no move. 11: Swamp 09: Objects, i.e. statues. 
// 08: Character goes invisible., i.e. inside house, behind other objects like trees, etc. 07: Water. 06 Bridge.
//
var Map = [[10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10,  10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10], 
           [10,11, 0, 0,11, 11,11,11,11, 11, 0, 0, 9, 0, 9,  0, 0, 8, 8, 0,  0, 9, 0, 0, 8,   8, 0, 8, 0, 8,  8, 8, 8, 8, 8,  8, 8, 8, 9, 9,  9, 9, 9, 0, 9,  9, 9, 9, 9,10], 
           [10,11, 0, 0, 0, 11,11,11,11, 0,  0, 0, 0, 0, 9,  0, 8, 8, 8, 8,  0, 9, 0, 0, 0,   0, 8, 8, 8, 8,  8, 8, 0, 8, 8,  8, 8, 8, 9, 0,  1, 0, 1, 0, 1,  0, 1, 0, 9,10],  
           [10,11,11, 0, 0,  0, 9, 0, 0, 0,  9, 0, 0, 0, 9,  0, 9, 9, 8, 9,  0, 9, 0, 0, 0,   0, 8, 8, 8, 8,  8, 8, 8, 0, 0,  0, 0, 0, 9, 0,  1, 0, 1, 0, 1,  0, 1, 0, 9,10], 
           [10,11,11,11, 0,  0, 0, 9, 0, 0,  0, 0, 0, 0, 9,  0, 9, 9, 8, 9,  0, 9, 0, 0, 0,   0, 0, 0, 0, 8,  8, 8, 8, 8, 0,  8, 0, 0, 9, 0,  1, 0, 1, 0, 1,  0, 1, 0, 9,10],
           
           [10, 0,11,11, 0,  0, 0, 0, 9, 0,  0, 0, 0, 0, 9,  0, 9, 9, 8, 9,  0, 9, 0, 0, 0,   0, 0, 8, 8, 8,  8, 8, 8, 8, 8,  8, 0, 0, 9, 0,  1, 0, 1, 0, 1,  0, 1, 0, 9,10], 
           [10, 0, 9, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 9,  0, 0, 0, 0, 0,  0, 9, 0, 0, 0,   0, 0, 8, 8, 0,  8, 8, 8, 8, 8,  8, 0, 0, 9, 8,  1, 0, 1, 0, 1,  0, 1, 0, 9,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 9,  9, 0, 0, 0, 0,  0, 9, 0, 0, 0,   0, 0, 0, 0, 0,  0, 8, 8, 8, 8,  0, 0, 0, 9, 0,  1, 0, 1, 0, 1,  0, 1, 0, 9,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 9,  9, 9, 0, 9, 9,  9, 9, 0, 0, 0,   0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 9, 9,  9, 9, 9, 0, 9,  9, 9, 9, 9,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,   0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0,10],
           
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  9, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,   0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 9, 0, 0, 0,  9, 0, 0, 0, 9,  0, 0, 0, 0, 9,   9, 9, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 7, 7, 7,  6, 6, 6, 7,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 9,   9, 9, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 7,  7, 7, 7, 7, 7,  6, 6, 6, 7,10], 
           [10, 9, 9, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 9, 0,  0, 0, 9, 0, 0,  0, 9, 0, 0, 9,   9, 9, 0, 0, 0,  0, 0, 0, 0, 7,  7, 7, 7, 7, 7,  7, 7, 7, 7, 7,  6, 6, 6, 7,10], 
           [10, 8, 8, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  9, 0, 0, 0, 0,   0, 0, 0, 0, 0,  0, 7, 7, 7, 7,  7, 7, 7, 7, 7,  7, 7, 7, 7, 7,  6, 6, 6, 0,10],
           
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  9, 0, 0, 0, 0,  0, 0, 0, 0, 0,   0, 0, 0, 0, 0,  7, 7, 7, 7, 7,  7, 7, 7, 7, 7,  7, 7, 7, 7, 0,  6, 6, 6, 0,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,   0, 0, 0, 0, 0,  7, 7, 7, 7, 7,  7, 7, 7, 7, 7,  7, 7, 0, 0, 0,  0, 0, 0, 0,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,   0, 0, 0, 0, 0,  7, 7, 7, 7, 7,  7, 7, 7, 7, 7,  7, 0, 0, 0, 0,  0, 0, 0, 0,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,   0, 0, 7, 7, 7,  7, 7, 7, 7, 7,  7, 7, 7, 7, 0,  0, 0, 8, 8, 8,  8, 0, 0, 0,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,   0, 7, 7, 7, 7,  7, 7, 7, 7, 7,  7, 7, 7, 0, 0,  0, 0, 9, 8, 8,  8, 0, 0, 0,10],
           
           [10, 0, 9, 8, 9,  0, 0, 0, 9, 8,  9, 0, 0, 0, 9,  8, 9, 0, 0, 0,  0, 0, 0, 0, 0,   7, 7, 7, 7, 7,  7, 7, 7, 7, 7,  7, 7, 0, 0, 0,  0, 0, 9, 8, 8,  8, 0, 0, 0,10], 
           [10, 0, 9, 8, 9,  0, 0, 0, 9, 8,  9, 0, 0, 0, 9,  8, 9, 0, 0, 0,  0, 0, 0, 6, 6,   6, 6, 6, 6, 6,  6, 6, 6, 6, 6,  6, 6, 0, 0, 0,  0, 0, 9, 9, 9,  9, 0, 0, 0,10], 
           [10, 0, 9, 9, 9,  0, 0, 0, 9, 9,  9, 0, 0, 0, 9,  9, 9, 0, 0, 0,  0, 0, 7, 7, 7,   7, 7, 7, 7, 7,  7, 7, 7, 7, 7,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0,10], 
           [10, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 7, 7, 7,   7, 7, 7, 7, 7,  7, 7, 0 ,0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0,10], 
           [10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10,  10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10, 10,10,10,10,10],
          ]

export default Map;