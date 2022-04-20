export class Maze {

  static getArrayFromWidth(uint8ClampedArray, width) {
    console.time('getArrayFromWidth')
    let newArrayFromWidth = []
    let arrayFromBin = Array.from(uint8ClampedArray)
    for (let i = 0; i < arrayFromBin.length / 4 / width; i++) {
      let tmpArr = []
      for (let ii = 0; ii < width; ii++) {
        tmpArr[ii] = this.isMazeInRow(arrayFromBin, (i * width + ii) * 4)
      }
      newArrayFromWidth[i] = tmpArr
    }
    console.timeEnd('getArrayFromWidth')
    return newArrayFromWidth
  }

  static isMazeInRow(arr, counter) {
    return arr[counter] + arr[counter + 1] + arr[counter + 2] < 700 ? 1 : 0
  }

  static getEveryPixel(array, func) {
    let direction = "";
    for (let count = 2; count--;) {
      for (let i = count ? 0 : array.length - 1; (count ? i < array.length : i >= 0); count ? i++ : i--) {
        for (let ii = count ? 0 : array[0].length - 1; (count ? ii < array[0].length : ii >= 0); count ? ii++ : ii--) {
          direction = count ? "toRight" : "toLeft"
          func(i, ii, direction)
        }
      }

      for (let i = count ? 0 : array[0].length - 1; (count ? i < array[0].length : i >= 0); count ? i++ : i--) {
        for (let ii = count ? 0 : array.length - 1; (count ? ii < array.length : ii >= 0); count ? ii++ : ii--) {
          direction = count ? "toDown" : "toUp"
          func(ii, i, direction)
        }
      }
    }
  }

  static drawResultOnCanvas(mazeMultidimensionalArray) {
    const colors = {
      red: [255, 0, 0, 255],
      blue: [0, 0, 255, 255],
      green: [0, 255, 0, 255],
      black: [0, 0, 0, 255],
      gray: [120, 120, 120, 255],
    }
    console.time('drawResultOnCanvas')
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d');
    let imageData = context.createImageData(canvas.offsetWidth, canvas.offsetHeight)
    const mazeArrayInOneLine = [];
    const arrayUint8 = [];
    for (let i = 0; i < mazeMultidimensionalArray.length; i++) {
      mazeArrayInOneLine.push(...mazeMultidimensionalArray[i])
    }
    for (let i = 0; i < mazeArrayInOneLine.length; i++) {

      switch (true) {
        case mazeArrayInOneLine[i] === 2: {
          arrayUint8.push(...colors.blue);
          break;
        }
        case mazeArrayInOneLine[i] === 0: {
          arrayUint8.push(...colors.gray);
          break;
        }
        case mazeArrayInOneLine[i] === -1: {
          arrayUint8.push(...colors.green);
          break;
        }
        case mazeArrayInOneLine[i] >= 3: {
          arrayUint8.push(...colors.red);
          break;
        }
        case mazeArrayInOneLine[i] === 1: {
          arrayUint8.push(...colors.black);
          break;
        }
        default:
          console.log('color incorrect!')
      }
    }
    imageData.data.set(arrayUint8)
    context.putImageData(imageData, 0, 0)
     console.timeEnd('drawResultOnCanvas')
  }

  static fillingPath(arrayFromMaze) {
    console.time('fillingPath')
    let fillingComplete = false;
    let count = 2;
    while (!fillingComplete) {
      Maze.getEveryPixel(arrayFromMaze, (i, ii, direction) => {
        if (arrayFromMaze[i][ii] === 0 && (arrayFromMaze[i - 1][ii] >= count || arrayFromMaze[i + 1][ii] >= count || arrayFromMaze[i][ii + 1] >= count || arrayFromMaze[i][ii - 1] >= count)) {
          let max = Math.max(arrayFromMaze[i - 1][ii], arrayFromMaze[i + 1][ii], arrayFromMaze[i][ii + 1], arrayFromMaze[i][ii - 1]) + 1
          arrayFromMaze[i][ii] = max;
          count = 3
          if (arrayFromMaze[i - 1][ii] === 0) {
            arrayFromMaze[i - 1][ii] = max
          }
          if (arrayFromMaze[i + 1][ii] === 0) {
            arrayFromMaze[i + 1][ii] = max
          }
          if (arrayFromMaze[i][ii + 1] === 0) {
            arrayFromMaze[i][ii + 1] = max
          }
          if (arrayFromMaze[i][ii - 1] === 0) {
            arrayFromMaze[i][ii - 1] = max
          }
        }
        if(arrayFromMaze[i][ii] > 40) {
          if (direction === 'toRight' && arrayFromMaze[i][ii + 1] === 2) fillingComplete = true
          if (direction === 'toLeft' && arrayFromMaze[i][ii - 1] === 2) fillingComplete = true
          if (direction === 'toDown' && arrayFromMaze[i + 1][ii] === 2) fillingComplete = true
          if (direction === 'toUp' && arrayFromMaze[i - 1][ii] === 2) fillingComplete = true
        }
      })

    }
    console.timeEnd('fillingPath')
    return arrayFromMaze
  }

  static borderFill(arrayFromMaze) {
    console.time('borderFill')
    let directionTemp = '', border = ''
    Maze.getEveryPixel(arrayFromMaze, (i, ii, direction) => {
      if (direction !== directionTemp) border = false;
      if (arrayFromMaze[i][ii] === 1) {
        border = true
      }
      if (!border) {
        arrayFromMaze[i][ii] = 2;
      }
      directionTemp = direction
    })
    console.timeEnd('borderFill')
    return arrayFromMaze
  }

  static findTheWayOut(arrayFromMaze) {
    console.time('findTheWayOut')
    let mazeComplete = 0;
    let count = 0;

    while (!mazeComplete) {
      Maze.getEveryPixel(arrayFromMaze, (i, ii, direction) => {
        if (((arrayFromMaze[i][ii] >= 50 && !count) || (arrayFromMaze[i][ii] >= 3 && count)) &&
          (!count || (count - arrayFromMaze[i][ii] <= 2 && count - arrayFromMaze[i][ii] >= 0))) {
          if (count <= 3 && count) mazeComplete = true


          switch (true) {
            case (direction === 'toRight' && ii > 0 && ii < arrayFromMaze[0].length - 1): {
              if ((arrayFromMaze[i][ii - 1] === 2 || arrayFromMaze[i][ii - 1] === -1)) {
                count = arrayFromMaze[i][ii];
                arrayFromMaze[i][ii] = -1;
              }
              break;
            }
            case (direction === 'toLeft' && ii > 0 && ii < arrayFromMaze[0].length - 1): {
              if ((arrayFromMaze[i][ii + 1] === 2 || arrayFromMaze[i][ii + 1] === -1)) {
                count = arrayFromMaze[i][ii];
                arrayFromMaze[i][ii] = -1;
              }
              break;
            }
            case (direction === 'toDown' && i > 0 && i < arrayFromMaze.length - 1): {
              if ((arrayFromMaze[i - 1][ii] === 2 || arrayFromMaze[i - 1][ii] === -1)) {
                count = arrayFromMaze[i][ii];
                arrayFromMaze[i][ii] = -1;
              }
              break;
            }
            case (direction === 'toUp' && i > 0 && i < arrayFromMaze.length - 1): {
              if ((arrayFromMaze[i + 1][ii] === 2 || arrayFromMaze[i + 1][ii] === -1)) {
                count = arrayFromMaze[i][ii];
                arrayFromMaze[i][ii] = -1;
              }
              break;
            }
          }
        }
      })
    }
    console.timeEnd('findTheWayOut')
    return arrayFromMaze
  }

  static fatAWay(arrayFromMaze) {
    console.time('fatWay')
    Maze.getEveryPixel(arrayFromMaze, (i, ii, direction) => {
      switch (true) {
        case (direction === 'toRight' && ii > 0 && ii < arrayFromMaze[0].length - 1): {
          if (arrayFromMaze[i][ii - 1] >= 3 && arrayFromMaze[i][ii] === -1) {
            arrayFromMaze[i][ii - 1] = -1;
          }
          break;
        }
        case (direction === 'toLeft' && ii > 0 && ii < arrayFromMaze[0].length - 1): {
          if (arrayFromMaze[i][ii + 1] >= 3 && arrayFromMaze[i][ii] === -1) {
            arrayFromMaze[i][ii + 1] = -1;
          }
          break;
        }
        case (direction === 'toDown' && i > 0 && i < arrayFromMaze.length - 1): {
          if (arrayFromMaze[i - 1][ii] >= 3 && arrayFromMaze[i][ii] === -1) {
            arrayFromMaze[i - 1][ii] = -1;
          }
          break;
        }
        case (direction === 'toUp' && i > 0 && i < arrayFromMaze.length - 1): {
          if (arrayFromMaze[i + 1][ii] >= 3 && arrayFromMaze[i][ii] === -1) {
            arrayFromMaze[i + 1][ii] = -1;
          }
          break;
        }
      }
    })

    console.timeEnd('fatWay')
    return arrayFromMaze
  }
}
