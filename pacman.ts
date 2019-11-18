class Pacman{
    speed = 7
    prefferedDir:Vector = new Vector(1,0)
    constructor(public pos:Vector, public dir:Vector){

    }

    draw(){
        if(vectorequal(this.dir,right)){
            pacmananimation.sprite.rotations = 0
        }else if(vectorequal(this.dir,down)){
            pacmananimation.sprite.rotations = 0.25
        }else if(vectorequal(this.dir,left)){
            pacmananimation.sprite.rotations = 0.5
        }else if(vectorequal(this.dir,up)){
            pacmananimation.sprite.rotations = 0.75
        }
        pacmananimation.draw(ctxt,this.pos.c().sub(pacmananimation.size.c().scale(0.5)),tilesize)
    }
}