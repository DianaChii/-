// Получение основных элементов страницы
var body = document.getElementsByTagName('body')[0];
var canvas = document.getElementById('hexmap');
// Функция для выполнения масштабирования окна
let windowScale = { 
    x: () => { return window.innerWidth * 0.96 },
    y: () => { return window.innerHeight * 0.75 },
};
// Вызов функций изменения размера экрана и фона
screenResize();
backgroundResize();
// Инициализация переменных
var hexHeight, 
    hexRadius, 
    hexRectangleHeight, 
    hexRectangleWidth, 
    hexagonAngle = 0.523598776, // 30 градусов в радианах
    scaleFactor = 16,
    sideLength = getScaling() * scaleFactor, 
    boardWidth = 47, 
    boardHeight = 21; 

    // Функция для обновления свойств шестиугольника на основе текущей длины и угла стороны
function updateHex() {
    hexHeight = Math.sin(hexagonAngle) * sideLength; 
    hexRadius = Math.cos(hexagonAngle) * sideLength; 
    hexRectangleHeight = sideLength + 2 * hexHeight; 
    hexRectangleWidth = 2 * hexRadius;
}
// Вызов функции обновления шестиугольника
updateHex();
// Работа с холстом
if (canvas.getContext){ 
    var ctx = canvas.getContext('2d'); 

    ctx.fillStyle = "#000000"; 
    ctx.strokeStyle = "blue"; 
    ctx.lineWidth = getScaling(); 
// Отображение доски
    drawBoard(boardWidth, boardHeight); 
  // Обработчик события перемещения мыши
    canvas.addEventListener("mousemove", function(eventInfo) { 
        var x, 
            y, 
            hexX, 
            hexY, 
            screenX, 
            screenY; 

        x = eventInfo.offsetX || eventInfo.layerX; 
        y = eventInfo.offsetY || eventInfo.layerY; 

        hexY = Math.floor(y / (hexHeight + sideLength)); 
        hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth); 

        screenX = hexX * hexRectangleWidth + ((hexY % 2) * hexRadius); 
        screenY = hexY * (hexHeight + sideLength); 

        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        drawBoard(boardWidth, boardHeight); 

        // Логика обработки движения мыши по доске 
        if(hexX >= 0 && hexX < boardWidth) { 
            if(hexY >= 0 && hexY < boardHeight) { 
                ctx.fillStyle = "blue";
                drawHexagon(ctx, screenX, screenY, true); 
            } 
        } 
    });
// Обработчик изменения размеров окна
    window.addEventListener("resize", () => {
        screenResize();
        backgroundResize();

        ctx.strokeStyle = "blue";

        ctx.lineWidth = getScaling();
        sideLength = ctx.lineWidth * scaleFactor;
        updateHex();

        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        drawBoard(boardWidth, boardHeight); 
    });
} 
// Функция отображения доски
// Циклы для создания сетки шестиугольников
function drawBoard(width, height) { 
    for(let i = 0; i < width; ++i) { 
        for(let j = 0; j < height; ++j) { 
            drawHexagon( 
                ctx,  
                i * hexRectangleWidth + ((j % 2) * hexRadius),  
                j * (sideLength + hexHeight),  
                false 
            ); 
        } 
    } 
} 
// Функция отображения шестиугольника
// Создание шестиугольника на холсте
function drawHexagon(canvasContext, x, y, fill) {            
    var fill = fill || false; 

    canvasContext.beginPath(); 
    canvasContext.moveTo(x + hexRadius, y); 
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight); 
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength); 
    canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight); 
    canvasContext.lineTo(x, y + sideLength + hexHeight); 
    canvasContext.lineTo(x, y + hexHeight); 
    canvasContext.closePath(); 

    if(fill) { 
        canvasContext.fill(); 
    } else { 
        canvasContext.stroke(); 
    } 
}
// Функция изменения размеров экрана
// Настройка размеров холста
function screenResize() {
    canvas.width = windowScale.x();
    canvas.height = windowScale.y();
}
// Функция изменения фона страницы
// Изменение размеров фона страницы
function backgroundResize() {
    if (window.innerWidth/1.8 >= window.innerHeight) {
        body.style['background-size'] = "100% auto";
    } else {
        body.style['background-size'] = "auto 100%";
    }
}
// Функция для расчета масштабирования
function getScaling() {
    return canvas.width / 1320;
}