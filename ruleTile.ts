class Sprite{
    constructor(public image:HTMLImageElement,
        public rotation:number,
        public xflipped:boolean,
        public yflipped:boolean,){

    }
}

// https://www.youtube.com/watch?v=Ky0sV9pua-E
class TileRule{
    sprite:Sprite
    grid:number[][]
}

class RuleTile{
    tilegrid:boolean[][]
    rules:TileRule[] = []

    getCorrectSprite(pos:Vector){

        for(var rule of this.rules){



        }
    }
}

//blockcorner * 4
//wallcorner * 4
//edgewallcorner * 4
//wall * 4
//edgewall * 4
//inner * 1
var images = []

function createRotatedSprites(image:HTMLImageElement,grid:number[][]){
    var sprites:TileRule[] = []
    for(var i = 0; i < 4; i++){
        sprites.push(new Sprite(image,i * 0.25,false,false))
    }
    return sprites
}

var ruleTile = new RuleTile()
ruleTile.rules = [
    
]

