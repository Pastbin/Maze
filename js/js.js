import {Maze} from "./mazeHandler.js";

const mazeInput = document.querySelector('.maze input')
mazeInput.addEventListener('change',fileHandler)

function fileHandler(e){
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();

  image.onload = () => {
    let timer = Date.now()
    let ratio = image.naturalWidth / image.naturalHeight
    context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    context.canvas.width = canvas.offsetHeight * ratio;
    context.drawImage(image, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    const data = context.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight).data;
    let arrayFromMaze = Maze.getArrayFromWidth(data, canvas.offsetWidth);
    Maze.borderFill(arrayFromMaze);
    Maze.fillingPath(arrayFromMaze);
    Maze.findTheWayOut(arrayFromMaze);
    Maze.fatAWay(arrayFromMaze);
    Maze.drawResultOnCanvas(arrayFromMaze);
  }
  if (e.target.files[0]) {
    image.src = URL.createObjectURL(e.target.files[0]);
  }
}

