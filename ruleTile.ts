class Sprite{
    constructor(
        public image:HTMLImageElement,
        public rotation:number,
        public xflipped:boolean,
        public yflipped:boolean,){

    }
}

// https://www.youtube.com/watch?v=Ky0sV9pua-E
class TileRule{
    constructor(
        public sprite:Sprite,
        public grid:number[][],){

    }
}

class RuleTile{
    tilegrid:boolean[][]
    rules:TileRule[] = []

    genSpriteGrid():Sprite[][]{
        var result = create2DArray(get2DArraySize(this.tilegrid),pos => this.rules.find(r => this.positionPassesRule(pos,r)).sprite)
        return result
    }

    positionPassesRule(pos:Vector,tilerule:TileRule){
        var result = true
        new Vector(3,3).loop2d(v => {
            var relpos = v.c().sub(new Vector(-1,-1))
            var abspos = pos.c().add(relpos)
            var requirement = index2D(tilerule.grid,relpos)
            if(requirement == 0){
                return
            }else {
                var isoccupied = false;
                if(contains(get2DArraySize(this.tilegrid).sub(one),abspos)){
                    isoccupied = index2D(this.tilegrid,abspos)
                }
                var matchingrequirement = (requirement == 1 && isoccupied) || (requirement == 2 && isoccupied == false)

                if(matchingrequirement){
                    return
                }else{
                    result = false
                    v.y = 3
                    v.x = 3
                    return
                }
            }
        })
        return result
    }
}

//blockcorner * 4
//wallcorner * 4
//edgewallcorner * 4
//wall * 4
//edgewall * 4
//inner * 1
var images:HTMLImageElement[] = []
function createRotatedSprites(image:HTMLImageElement,grid:number[][]){
    var sprites:TileRule[] = []

    for(var i = 0; i < 4; i++){
        var rotatedcopy = rotateMatrix(copy2dArray(grid),i)
        
        sprites.push(new TileRule(new Sprite(image,i * 0.25,false,false),rotatedcopy))
    }
    return sprites
}

function rotateMatrix(arr:number[][],nineties:number){
    return create2DArray(get2DArraySize(arr), pos => {
        var rotatedpos = rotate2dCenter(pos.c(),nineties * -0.25, one)
        return index2D(arr,rotatedpos)
    })
}

