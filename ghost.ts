enum GhostState{normal,eaten,fleeing}

class Ghost{
    state:GhostState = GhostState.normal
    dir:Vector = new Vector(1,0)

    constructor(public pos:Vector, public color:string, public scattertile:Vector, public target:() => Vector){

    }

    getspeed(){
        if(this.state == GhostState.eaten){
            return 12
        }else if(this.state == GhostState.fleeing){
            return 3
        }else if(this.state == GhostState.normal){
            return 6
        }
    }

    getTarget(){
        if(this.state == GhostState.eaten){
            return new Vector(13,16)
        }
        else if(this.state == GhostState.fleeing){
            return [new Vector(0,0), new Vector(levelsize.x,levelsize.y), new Vector(levelsize.x,0),new Vector(0,levelsize.y)][Math.floor(random(0,4))]
        }else{
            if(scattermode){
                return this.scattertile
            }else{
                return this.target()
            }
        } 
    }

    draw(){
        ctxt.fillStyle = this.color
        if(this.state == GhostState.fleeing){
            ctxt.fillStyle = 'blue'
        }else if(this.state == GhostState.eaten){
            ctxt.fillStyle = 'grey'
        }
        fillrectCenteredGrid(this.pos)
    }
}