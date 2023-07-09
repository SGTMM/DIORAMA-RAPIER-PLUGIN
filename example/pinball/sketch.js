var block1, block2, ball, backplate, frontplate, leftside, rightside, catching_block, leftside_carry, carry_platform, upper_pusher;

var xaxis, zaxis;

var leftside, rightside, top, leftdoor, rightdoor;

var moveDirection = { left: 0, right: 0, forward: 0, back: 0 }

var x;
var y = 45;

var toggle = 1;

var sensor1, sensor2, sensor3, sensor4;

var start = true;
var game_start = false

document.body.addEventListener("mousedown", start_game);

function start_game() {
    game_start = true
    document.getElementsByClassName("title")[0].style.display = "none"
    document.getElementsByClassName("button")[0].style.display = "none"
}

function setup() {
    createCanvas3D(window.innerWidth, window.innerHeight);
    setupPhysics()
    setCamera(0, 0, -100, 0, 0, 0);
    hideGrid()
    hideToolbox()
    //Change background color of the scene
    background3D("#808080");
    getScene().fog = new THREE.Fog(0x808080, 2, 200);

    backplate = fixedBox({ x: 2, y: 0, z: 0 }, { x: 54, y: 110, z: 2 }, { x: 0, y: 0, z: 0 })
    frontplate = fixedBox({ x: 2, y: 0, z: -7 }, { x: 54, y: 110, z: 2 }, { x: 0, y: 0, z: 0 })
    frontplate.material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        roughness: 0.1,
        ior: 1.5
    })

    rightside = fixedBox({ x: -23.75, y: 0, z: -3 }, { x: 2.5, y: 110, z: 6.25 }, { x: 0, y: 0, z: 0 })
    leftside = fixedBox({ x: 23.75, y: 0, z: -3 }, { x: 2.5, y: 100, z: 6.25 }, { x: 0, y: 0, z: 0 })

    catching_block = fixedBox({ x: 0, y: -53.5, z: -3.5 }, { x: 50, y: 2, z: 5 }, { x: 0, y: 0, z: -6 })

    carry_platform = kinematicBox({ x: 27, y: -56, z: -3.5 }, { x: 4, y: 2, z: 5 }, { x: 0, y: 0, z: 0 })

    leftside_carry = fixedBox({ x: 30.25, y: 0, z: -3.5 }, { x: 2.5, y: 110, z: 6.25 }, { x: 0, y: 0, z: 0 })

    upper_pusher = fixedBox({ x: 27, y: 55, z: -3.5 }, { x: 4, y: 1, z: 5 }, { x: 0, y: 0, z: 0 })

    diffuse("green")

    for (let i = 0; i < 24; i++) {
        if (toggle === -1) {
            x = -13;
        } else {
            x = -15;
        }

        for (let j = 0; j < 8; j++) {
            fixedCylinder({ x: x * 1.5, y: y, z: -3.5 }, 1, 5, { x: 90, y: 0, z: 0 })
            x += 4;
        }
        y -= 4;
        toggle *= -1

    }

    diffuse("orange")
    ball = dynamicSphere({ x: 0, y: 60, z: -3.5 }, 1, { x: 0, y: 0, z: 0 }, 1)

    sensor1 = boxCollider({ x: 27, y: -53, z: -3.5 }, { x: 2, y: 2, z: 5 }, { x: 0, y: 0, z: 0 }, false)
    sensor2 = boxCollider({ x: 27, y: 53, z: -3.5 }, { x: 4, y: 2, z: 5 }, { x: 0, y: 0, z: 0 }, false)
    sensor3 = boxCollider({ x: 0, y: 40, z: -3.5 }, { x: 45, y: 2, z: 5 }, { x: 0, y: 0, z: 0 }, false)
    sensor4 = boxCollider({ x: 27, y: -58, z: -3.5 }, { x: 2, y: 2, z: 5 }, { x: 0, y: 0, z: 0 }, false)

    addToCollisionCheck(ball, sensor1)
    addToCollisionCheck(ball, sensor2)
    addToCollisionCheck(ball, sensor3)
    addToCollisionCheck(carry_platform, sensor4)

    setupEventHandlers();

}

function setupEventHandlers() {
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
}

var elevator_toggle = 0
var restart = false

var moveX;

function draw() {
    if (game_start) {
        updatePhysics()

        moveX = moveDirection.right - moveDirection.left;

        Impulse(ball, { x: -moveX, y: 0, z: 0.0 });

        checkCollision()

        if (Contact(ball, sensor1)) {
            elevator_toggle = 1
        }

        if (Contact(ball, sensor2)) {
            elevator_toggle = 2
        }

        if (Contact(ball, sensor3)) {
            elevator_toggle = 3
        }

        if (Contact(carry_platform, sensor4)) {
            elevator_toggle = 4
        }

        move_platform()
    }

}

function move_platform() {
    if (elevator_toggle === 1) {
        restart = true
        start = false
        kinematicMove(carry_platform, { x: carry_platform.position.x, y: carry_platform.position.y + 0.4, z: carry_platform.position.z })
    } else if (elevator_toggle === 2) {
        kinematicMove(carry_platform, { x: carry_platform.position.x, y: carry_platform.position.y, z: carry_platform.position.z })
    } else if (elevator_toggle === 3 && start === false) {
        restart = false
        kinematicMove(carry_platform, { x: carry_platform.position.x, y: carry_platform.position.y - 0.4, z: carry_platform.position.z })
    } else if (elevator_toggle === 4 && restart === false) {
        kinematicMove(carry_platform, { x: carry_platform.position.x, y: carry_platform.position.y, z: carry_platform.position.z })
    }
}

function handleKeyDown(event) {

    let keyCode = event.keyCode;

    switch (keyCode) {
        case 87: //W: FORWARD
            moveDirection.forward = 1
            break;

        case 83: //S: BACK
            moveDirection.back = 1
            break;

        case 65: //A: LEFT
            moveDirection.left = 1
            break;

        case 68: //D: RIGHT
            moveDirection.right = 1
            break;
    }
}


function handleKeyUp(event) {
    let keyCode = event.keyCode;

    switch (keyCode) {
        case 87: //FORWARD
            moveDirection.forward = 0
            break;

        case 83: //BACK
            moveDirection.back = 0
            break;

        case 65: //LEFT
            moveDirection.left = 0
            break;

        case 68: //RIGHT
            moveDirection.right = 0
            break;

    }

}