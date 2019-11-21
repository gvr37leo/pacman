

// https://www.youtube.com/watch?v=Ky0sV9pua-E
class RuleTileRule{
    constructor(
        public sprite:Sprite,
        public grid:number[][],){

    }
}

class RuleTile{
    tilegrid:number[][]
    rules:RuleTileRule[] = []

    constructor(public wallnumber,public ignorenumber,public emptynumber,public voidnumber,public unfilledtilenumber){

    }

    genSpriteGrid():Sprite[][]{
        var result = create2DArray(get2DArraySize(this.tilegrid),pos => {
            if(index2D(this.tilegrid,pos) != this.wallnumber){
                return null
            }else{
                var rule = this.rules.find(r => this.positionPassesRule(pos,r))
                if(rule == null)return null
                else return rule.sprite
            }
        })
        return result
    }

    positionPassesRule(pos:Vector,ruleTileRule:RuleTileRule){
        var result = true
        new Vector(3,3).loop2d(v => {
            var relpos = v.c().add(new Vector(-1,-1))
            var abspos = pos.c().add(relpos)
            var requirement = index2D(ruleTileRule.grid,v)
            //-1 other
            //-2 empty
            //1 wall
            //2 highground

            var tiletype = this.voidnumber
            if(boxcontain(get2DArraySize(this.tilegrid).sub(one),abspos)){
                tiletype = index2D(this.tilegrid,abspos)
            }

            if(requirement == -1){
                return//continue
            }
            else if(requirement == -2){
                if(tiletype == this.unfilledtilenumber){
                    return
                }else{
                    //goto end and break
                }
            }else if(requirement == -1){
                return//continue
            }else{//requirement >= 0
                if(tiletype == requirement){
                    return//continue
                }else{
                    //goto end and break
                }
            }
            result = false
            v.y = 3
            v.x = 3
            return
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
function createRotatedSprites(image:HTMLImageElement,grid:number[][],xflipped = false, yflipped = false){
    var sprites:RuleTileRule[] = []

    for(var i = 0; i < 4; i++){
        var rotatedcopy = rotateMatrix(copy2dArray(grid),i)
        
        sprites.push(new RuleTileRule(new Sprite(ImageView.fromImage(image),i * 0.25,xflipped,yflipped),rotatedcopy))
    }
    return sprites
}

function rotateMatrix(arr:number[][],nineties:number){
    return create2DArray(get2DArraySize(arr), pos => {
        var rotatedpos = round(rotate2dCenter(pos.c(),nineties * -0.25, one))
        return index2D(arr,rotatedpos)
    })
}

