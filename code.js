let game 

var coldown_desh = false
var desh_Length = 20 
var last_direction = true
var isEnemiAlive = [0, 0, 0]
var shootCoolDown = 0

var coldown_jump = -1


var desh_event;



const gameOptions = 
{
    dudeGravity: 800,
    dudeSpeed: 300
}







window.onload = function()
{
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#552F44",
        scale:{
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 2400,
            height: 1000,
        },
        pixelArr: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: PlayGame
    }
    game = new Phaser.Game(gameConfig)
    window.focus();
}

class PlayGame extends Phaser.Scene {

    constructor()
    {
        super("PlayGame")
    }

    preload() {
        this.load.image("ground", "./img/block.png")
        this.load.spritesheet("charecter_right", "./img/charecter_move_right_test.png", 
            {frameWidth: 170, frameHeight: 127})
        this.load.spritesheet("charecter_left", "./img/charecter_move_left_test.png", 
            {frameWidth: 170, frameHeight: 127})
        this.load.spritesheet("charecter_jump_left", "./img/charecter_jump_left.png", 
            {frameWidth: 170, frameHeight: 127})
        this.load.spritesheet("charecter_jump_right", "./img/charecter_jump_right.png", 
            {frameWidth: 170, frameHeight: 127}) 
        this.load.spritesheet("charecter_desh_right", "./img/charecter_desh_right.png", 
            {frameWidth: 170, frameHeight: 127})            
        this.load.spritesheet("charecter_desh_left", "./img/charecter_desh_left.png", 
            {frameWidth: 170, frameHeight: 127})
        this.load.image("charecter_static_right", "./img/charecter_static_right.png", 
            {frameWidth: 170, frameHeight: 127})
        this.load.image("charecter_static_left", "./img/charecter_static_left.png", 
            {frameWidth: 170, frameHeight: 127})




        this.load.spritesheet("guard_right", "img/guard.png", 
            {frameWidth: 165, frameHeight: 150})
        this.load.spritesheet("guard_dead", "img/guard_dead.png", 
            {frameWidth: 165, frameHeight: 150})     
        this.load.spritesheet("guard_left", "img/guard_left.png", 
            {frameWidth: 165, frameHeight: 150})
            
        this.load.image("bullet", "./img/bulet.png", 
            {frameWidth: 10, frameHeight: 10})  

    }

    coolDown_desh(){
        console.log("The desh cooldown is successful")
        coldown_desh = false
        desh_event = this.time.delayedCall(1000, this.coolDown_desh, [], this)
    }


    addEnemi(x, y){
        this.enemiGroup.create(x, y, "guard_right")
        this.enemiGroup.setVelocityY(gameOptions.dudeGravity)
        this.enemiGroup.playAnimation("guard_static", true)
    }
    enemiKill(dude, enemi)
    {
        var i = 0
        enemi.anims.play("guard_death", true)
        this.enemiGroup.children.iterate(_enemi => {
            if(_enemi == enemi)
            {
                isEnemiAlive[i] = 0
            }
            i+=1
        })
    }
    addAnimations()
    {
        this.anims.create(
            {
                key: "right",
                frames: this.anims.generateFrameNumbers("charecter_right", {start: 0, end: 6}), frameRate: 10, repeat:-1
            }
        )
        
        this.anims.create(
            {
                key: "left",
                frames: this.anims.generateFrameNumbers("charecter_left", {start: 0, end: 6}), frameRate: 10, repeat:-1
            }
        )
        this.anims.create(
            {
                key: "jump_right",
                frames: this.anims.generateFrameNumbers("charecter_jump_right", {start: 0, end: 1}), frameRate: 10, repeat:-1
            }
        )
        this.anims.create(
            {
                key: "jump_left",
                frames: this.anims.generateFrameNumbers("charecter_jump_left", {start: 0, end: 1}), frameRate: 10, repeat:-1
            }
        )
        this.anims.create(
            {
                key: "desh_right",
                frames: this.anims.generateFrameNumbers("charecter_desh_right", {start: 0, end: 7}), frameRate: 10, repeat: 1
            }
        )
        this.anims.create(
            {
                key: "desh_left",
                frames: this.anims.generateFrameNumbers("charecter_desh_left", {start: 0, end: 7}), frameRate: 10, repeat: 1
            }
        )


        this.anims.create(
            {
                key: "guard_static",
                frames: this.anims.generateFrameNumbers("guard_right", {start: 0, end: 6}), frameRate: 10, repeat: -1
            }
        )
        this.anims.create(
            {
                key: "guard_death",
                frames: this.anims.generateFrameNumbers("guard_dead", {start: 0, end: 1}), frameRate: 10, repeat: -1
            }
        )
        this.anims.create(
            {
                key: "guard_static_left",
                frames: this.anims.generateFrameNumbers("guard_left", {start: 0, end: 6}), frameRate: 10, repeat: -1
            }
        )
    }

    charecterHit()
    {
        this.scene.start("PlayGame")
    }
    buletdisable(bullet, block)
    {
        bullet.disableBody(true, true)
    }


    enemiSight()
    {
        var k = 0
        this.enemiGroup.children.iterate(enemi => {
            if(isEnemiAlive[k] == 1)
            {
                this.buletGroup.create(enemi.body.position.x+60, enemi.body.position.y + 80, "bullet")
                if(enemi.body.position.x - this.dude.body.position.x > 0)
                {
                    var new_bullet
                    enemi.anims.play("guard_static_left", true)
                    this.buletGroup.children.iterate(_bullet => {
                        new_bullet = _bullet
                    })
                    new_bullet.setVelocityX(-gameOptions.dudeSpeed*(3))

                    //this.buletGroup.setVelocityX(-gameOptions.dudeSpeed*(3))
                }
                else{
                    enemi.anims.play("guard_static", true)
                    
                    var new_bullet
                    this.buletGroup.children.iterate(_bullet => {
                        new_bullet = _bullet
                    })
                    new_bullet.setVelocityX(gameOptions.dudeSpeed*(3))
                    //this.buletGroup.setVelocityX(gameOptions.dudeSpeed*(3))
                }
            }
            k+=1
        })
    }

    create()
    {
        isEnemiAlive = [1, 1, 1]
        this.groundGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })


        for(let i = 0; i < 30; i++)
        {
            this.groundGroup.create(game.config.width/30*i, 970, "ground");
        }
        for(let i = 0; i < 5; i++)
        {
            this.groundGroup.create(game.config.width/30*i, 700, "ground");
            this.groundGroup.create(700 + game.config.width/30*i, 400, "ground");
            this.groundGroup.create(1600 + game.config.width/30*i, 700, "ground");
        }
        this.groundGroup.create(1300, 550, "ground");
        for(let i = 0; i < 20; i++)
        {
            this.groundGroup.create(0, game.config.height/20*i, "ground");
        }
        for(let i = 0; i < 20; i++)
        {
            this.groundGroup.create(2400, game.config.height/20*i, "ground");
        }

        


        this.dude = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "charecter_right")
        this.dude.body.gravity.y = gameOptions.dudeGravity


        this.physics.add.collider(this.dude, this.groundGroup)

        this.enemiGroup = this.physics.add.group({})
        this.physics.add.collider(this.enemiGroup, this.groundGroup)
        this.physics.add.overlap(this.dude, this.enemiGroup, this.enemiKill, null, this)
        
        this.buletGroup = this.physics.add.group({})
        this.physics.add.overlap(this.buletGroup, this.groundGroup, this.buletdisable, null, this)
        this.physics.add.overlap(this.dude, this.buletGroup, this.charecterHit, null, this)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.addAnimations()

        this.addEnemi(1000, 100)
        this.addEnemi(200, 100)
        this.addEnemi(1800, 100)


        desh_event = this.time.delayedCall(3000, this.coolDown_desh, [], this)


    }
    update()
    {
        
        if(this.cursors.left.isDown)
        {   
            this.dude.body.velocity.x = -gameOptions.dudeSpeed
            last_direction = false
            if(this.dude.body.touching.down)
            {
                this.dude.anims.play("left", true)
            }
            else{
                this.dude.anims.play("jump_left", true)
            }   
        }
        else if(this.cursors.right.isDown)
        {
            this.dude.body.velocity.x = gameOptions.dudeSpeed
            last_direction = true
            if(this.dude.body.touching.down)
            {
            this.dude.anims.play("right", true)
            }
            else{
                this.dude.anims.play("jump_right", true)
            } 
        }
        else{
            if(this.dude.body.touching.down){
                this.dude.body.velocity.x = 0
                if(last_direction)
                {
                    this.dude.setTexture("charecter_static_right", true)
                }
                else
                {
                    this.dude.setTexture("charecter_static_left", true)
                }
            }
            
        }
        let keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        if(keyC.isDown && coldown_desh == false){
            console.log("desh successful")
            if(this.cursors.left.isDown)
            {
                this.dude.anims.play("desh_left", true)
            }
            else{
                this.dude.anims.play("desh_right", true)
            }
            this.dude.body.velocity.x *=3 
            if(this.dude.body.velocity.x > 900)
            {
                this.dude.body.velocity.x = 900   
            }
            desh_Length -= 1
            if(desh_Length <= 0){
                coldown_desh = true
                desh_Length = 20
                desh_event.getProgress()
            }
            
        }

        if(this.cursors.up.isDown && this.dude.body.touching.down)
        {
            if(this.cursors.left.isDown)
            {
                this.dude.anims.play("jump_left", true)
            }
            else{
                this.dude.anims.play("jump_right", true)
            }

            this.dude.body.velocity.y = -gameOptions.dudeGravity*0.75
            coldown_jump = 20
            
        }
        if(this.cursors.up.isDown && coldown_jump > 0){
            coldown_jump -= 1
            this.dude.body.velocity.y -= 22
        }


        shootCoolDown -= 1
        if(shootCoolDown <= 0)
        {
            this.enemiSight()
            shootCoolDown = 90
        }
        
    }

    

}