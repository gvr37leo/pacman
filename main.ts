/// <reference path="node_modules/vectorx/vector.ts" />
/// <reference path="node_modules/utilsx/utils.ts" />
/// <reference path="node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="pacman.ts" />
/// <reference path="ghost.ts" />
/// <reference path="projectutils.ts" />



var levelsize = new Vector(28,36)
var tilesize =  new Vector(20,20)
var screensize = levelsize.c().mul(tilesize)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt


var colors = ['black','white','blue','red','yellow']
var colorsrgb = [[0,0,0],[255,255,255],[0,38,255],[255,0,0],[255,216,0]]
enum Tiletype{wall,blank,powerup,fruit,dot}

var score = 0
var highscore = 0
var dotseaten = 0
var amountofdots = 0
var scattermode = false
var blinky = new Ghost(new Vector(12.5,14.5),'red',new Vector(levelsize.x - 3,0),() => {return pacman.pos.c()})
var pinky = new Ghost(new Vector(13.5,14.5),'pink',new Vector(2,0),() => {return pacman.pos.c().add(pacman.dir.c().scale(4))})
var inky = new Ghost(new Vector(14.5,14.5),'cyan',new Vector(levelsize.x - 1,levelsize.y),() => {
    var ahead = pacman.pos.c().add(pacman.dir.c().scale(2))
    return blinky.pos.c().add(blinky.pos.to(ahead).scale(2)) 
})
var clyde:Ghost = new Ghost(new Vector(15.5,14.5),'orange',new Vector(0,levelsize.y),() => {return clyde.pos.to(pacman.pos).length() > 8 ? pacman.pos.c() : clyde.fleetile})
var ghosts = [blinky,pinky,inky,clyde]//

var pacman = new Pacman(new Vector(6.5,15.5),new Vector(1,0))
var board:Tiletype[][];
var onPacmanDead = new EventSystem<number>()

document.addEventListener('keydown',e => {
    pacman.prefferedDir.x = 0
    pacman.prefferedDir.y = 0
    if(e.key == 'w'){
        pacman.prefferedDir.y = -1
    }else if(e.key == 's'){
        pacman.prefferedDir.y = 1
    }else if(e.key == 'a'){
        pacman.prefferedDir.x = -1
    }else if(e.key == 'd'){
        pacman.prefferedDir.x = 1
    }
})
loadImages(['/levels/level1.png']).then(images => {
    board = convertImageData2board(convertImages2Imagedata(images)[0])
    amountofdots = countDots()
    loop((dt) => {
        dt /= 1000
        dt = clamp(dt,0,1/100)

        //begin pacman
        var posibillities = getMovePossibilities(floor(pacman.pos.c()))
        var dirlookup = pacman.prefferedDir.c().add(new Vector(1,1))
        if(posibillities[dirs[dirlookup.y][dirlookup.x]]){// && distanceToTileCenter(pacman.pos) < 0.1
            pacman.dir.overwrite(pacman.prefferedDir)
        }
        

        
        pacman.pos.add(pacman.dir.c().scale(pacman.speed * dt))//move pacman
        pacman.pos.map((arr,i) => arr[i] = mod(arr[i],levelsize.vals[i]))//wrap around map
        keeponrail(pacman.pos,pacman.dir)

        for(var i = 0; i < 4;i++){//bump into walls
            if(arrayequal(dirvecs[i].vals,pacman.dir.vals) && getQuadrant(pacman.pos) == i && posibillities[i] == false){
                pacman.pos.vals[(i + 1) % 2] = Math.floor(pacman.pos.vals[(i + 1) % 2]) + 0.5
            }    
        }

        var pacmanroundpos = floor(pacman.pos.c())
        var currenttile = board[pacmanroundpos.y][pacmanroundpos.x]

        if(currenttile == Tiletype.dot){
            board[pacmanroundpos.y][pacmanroundpos.x] = Tiletype.blank
            score += 10
        }else if(currenttile == Tiletype.fruit){
            board[pacmanroundpos.y][pacmanroundpos.x] = Tiletype.blank
        }else if(currenttile == Tiletype.powerup){
            board[pacmanroundpos.y][pacmanroundpos.x] = Tiletype.blank
            score += 50
        }
        //end pacman


        //begin ghosts
        for(var ghost of ghosts){
            if(distanceToTileCenter(ghost.pos) < 0.1){
                var posibillities = getMovePossibilities(floor(ghost.pos.c()))
                var reversedir = ghost.dir.c().scale(-1).add(new Vector(1,1))
                posibillities[dirs[reversedir.y][reversedir.x]] = false
                var target = ghost.getTarget()
                
                var bestindex = findbest(posibillities.map((v,i) => i).filter(i => posibillities[i]),i => {
                        return -ghost.pos.c().add(dirvecs[i]).to(target).length()
                })
                ghost.dir.overwrite(dirvecs[bestindex])
            }

            ghost.pos.add(ghost.dir.c().scale(ghost.speed * dt))//move ghostman
            ghost.pos.map((arr,i) => arr[i] = mod(arr[i],levelsize.vals[i]))//wrap around map
            keeponrail(ghost.pos,ghost.dir)

            if(vectorequal(round(ghost.pos.c()),pacmanroundpos)){
                onPacmanDead.trigger(0)
            }
        }
        //end ghosts


        ctxt.clearRect(0,0,screensize.x,screensize.y)
        drawboard(board)
        pacman.draw()
        ghosts.forEach(g => g.draw())
    })
})

enum Direction{north,east,south,west}
var dirvecs = [new Vector(0,-1),new Vector(1,0),new Vector(0,1),new Vector(-1,0),]
var dirs = [
    [-1, 0,-1],
    [ 3,-1, 1],
    [-1, 2,-1],
]
function getMovePossibilities(pos:Vector){
    var result:boolean[] = new Array(4)
    for(var i = 0; i < dirvecs.length;i++){
        var c = pos.c().add(dirvecs[i])
        if(inRange(0,levelsize.x - 1,c.x) && inRange(0,levelsize.y - 1,c.y)){
            result[i] = board[c.y][c.x] != Tiletype.wall
        }else{
            result[i] = true
        }
        
    }
    return result
}

function drawboard(board:Tiletype[][]){
    levelsize.loop2d(v => {
        var tiletype = board[v.y][v.x]
        ctxt.fillStyle = colors[tiletype]
        fillrect(v)
    })
}

function distanceToTileCenter(v:Vector){
    return v.c().sub(floor(v.c())).sub(new Vector(0.5,0.5)).length()
}

function countDots(){
    var count = 0
    new Vector(board[0].length,board.length).loop2d(v => {
        if(board[v.y][v.x] == Tiletype.dot){
            count++
        }
    })
    return count
}

function keeponrail(pos:Vector,dir:Vector){
    if(dir.x != 0){//when moving horizontal keep y centered
        pos.y = Math.floor(pos.y) + 0.5
    }else if(dir.y != 0){//when moving vertical keep x centered
        pos.x = Math.floor(pos.x) + 0.5
    }
}