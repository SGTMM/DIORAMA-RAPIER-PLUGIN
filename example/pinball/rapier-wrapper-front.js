function dynamicBox(pos, scale, quat, mass) {
    var obj = box(pos.x, pos.y, pos.z, scale.x, scale.y, scale.z)
    obj.setRotationX(quat.x)
    obj.setRotationY(quat.y)
    obj.setRotationZ(quat.z)
    return DynamicBox(obj, pos, scale, quat, mass), obj;
}

function dynamicSphere(pos, radius, quat, mass) {
    var obj = sphere(pos.x, pos.y, pos.z, radius);
    obj.setRotationX(quat.x)
    obj.setRotationY(quat.y)
    obj.setRotationZ(quat.z)
    return DynamicSphere(obj, pos, radius, quat, mass), obj;
}

function fixedBox(pos, scale, quat) {
    var obj = box(pos.x, pos.y, pos.z, scale.x, scale.y, scale.z);
    obj.setRotationX(quat.x)
    obj.setRotationY(quat.y)
    obj.setRotationZ(quat.z)
    return FixedBox(obj, pos, scale, quat), obj
}

function kinematicBox(pos, scale, quat) {
    var obj = box(pos.x, pos.y, pos.z, scale.x, scale.y, scale.z);
    obj.setRotationX(quat.x)
    obj.setRotationY(quat.y)
    obj.setRotationZ(quat.z)
    return KinematicBox(obj, pos, scale, quat), obj
}

function boxCollider(pos, scale, quat, visible) {
    if (visible === true) {
        var obj = box(pos.x, pos.y, pos.z, scale.x, scale.y, scale.z);
        obj.setRotationX(quat.x)
        obj.setRotationY(quat.y)
        obj.setRotationZ(quat.z)
    }
    return BoxCollider(pos, scale, quat)
}

function dynamicCylinder(pos, radius, height, quat, mass) {

}

function fixedCylinder(pos, radius, height, quat) {
    var obj = cylinder(pos.x, pos.y, pos.z, radius, height);
    obj.setRotationX(quat.x)
    obj.setRotationY(quat.y)
    obj.setRotationZ(quat.z)
    return FixedCylinder(obj, pos, radius, height, quat), obj
}

function kinematicMove(obj, pos) {
    obj.position.x = pos.x
    obj.position.y = pos.y
    obj.position.z = pos.z
    KinematicMove(obj, pos);
}

var collisionarray = []


function checkCollision() {
    CheckCollision(collisionarray)
}

function addToCollisionCheck(obj1, obj2) {
    collisionarray.push([obj1, obj2, false])
}
