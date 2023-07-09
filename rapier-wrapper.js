import rapier from "@dimforge/rapier3d-compat";

var rigidBodies = [];

rapier.init().then(() => {

    window.setupPhysics = setupPhysics;
    window.updatePhysics = updatePhysics;
    window.DynamicBox = DynamicBox;
    window.DynamicSphere = DynamicSphere;
    window.FixedBox = FixedBox;
    window.Impulse = Impulse;
    window.test = test;
    window.FixedCylinder = FixedCylinder
    window.KinematicBox = KinematicBox
    window.BoxCollider = BoxCollider
    window.Contact = Contact
    window.KinematicMove = KinematicMove
    window.CheckCollision = CheckCollision


});

var world, gravity;

let eventQueue;

const setupPhysics = () => {
    gravity = { x: 0.0, y: -9.81, z: 0.0 };
    world = new rapier.World(gravity);
    eventQueue = new rapier.EventQueue(true);
    return world

}

const test = (body1, body2, joint1, joint2) => {
    let params = rapier.JointData.spherical(joint1, joint2);
    let joint = world.createImpulseJoint(params, body1.userData.physicsBody, body2.userData.physicsBody, true);
}

const FixedBox = (obj, pos, scale, quat) => {
    var rbInfo = rapier.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z)
    var rb = world.createRigidBody(rbInfo);
    var angle = eulerToQuaternion(quat.x, quat.y, quat.z)
    var rbColliderInfo = rapier.ColliderDesc.cuboid(scale.x / 2, scale.y / 2, scale.z / 2).setRotation({ w: angle.w, x: angle.x, y: angle.y, z: angle.z }).setActiveEvents(rapier.ActiveEvents.COLLISION_EVENTS).setActiveCollisionTypes(rapier.ActiveCollisionTypes.DEFAULT | rapier.ActiveCollisionTypes.KINEMATIC_FIXED);
    var rbCollider = world.createCollider(rbColliderInfo, rb);

    obj.userData.physicsBody = rb

    return rb
}

const KinematicBox = (obj, pos, scale, quat) => {
    var rbInfo = rapier.RigidBodyDesc.kinematicPositionBased().setTranslation(pos.x, pos.y, pos.z)
    var rb = world.createRigidBody(rbInfo);
    var angle = eulerToQuaternion(quat.x, quat.y, quat.z)
    var rbColliderInfo = rapier.ColliderDesc.cuboid(scale.x / 2, scale.y / 2, scale.z / 2).setRotation({ w: angle.w, x: angle.x, y: angle.y, z: angle.z }).setActiveEvents(rapier.ActiveEvents.COLLISION_EVENTS).setActiveCollisionTypes(rapier.ActiveCollisionTypes.DEFAULT | rapier.ActiveCollisionTypes.KINEMATIC_FIXED);
    var rbCollider = world.createCollider(rbColliderInfo, rb);

    obj.userData.physicsBody = rb
    return rb
}
var c;
const BoxCollider = (pos, scale, quat) => {
    var angle = eulerToQuaternion(quat.x, quat.y, quat.z)
    var ColliderInfo = rapier.ColliderDesc.cuboid(scale.x / 2, scale.y / 2, scale.z / 2).setTranslation(pos.x, pos.y, pos.z).setRotation({ w: angle.w, x: angle.x, y: angle.y, z: angle.z }).setActiveEvents(rapier.ActiveEvents.COLLISION_EVENTS).setActiveCollisionTypes(rapier.ActiveCollisionTypes.DEFAULT | rapier.ActiveCollisionTypes.KINEMATIC_FIXED);
    var Collider = world.createCollider(ColliderInfo);
    Collider.setSensor(true);
    c = Collider
    return Collider
}

const FixedCylinder = (obj, pos, radius, height, quat) => {
    var rbInfo = rapier.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z)
    var rb = world.createRigidBody(rbInfo);
    var angle = eulerToQuaternion(quat.x, quat.y, quat.z)
    var rbColliderInfo = rapier.ColliderDesc.cylinder(height / 2, radius).setRotation({ w: angle.w, x: angle.x, y: angle.y, z: angle.z }).setActiveEvents(rapier.ActiveEvents.COLLISION_EVENTS).setActiveCollisionTypes(rapier.ActiveCollisionTypes.DEFAULT | rapier.ActiveCollisionTypes.KINEMATIC_FIXED)
    var rbCollider = world.createCollider(rbColliderInfo, rb);

    obj.userData.physicsBody = rb

    return rb
}

const DynamicBox = (obj, pos, scale, quat, mass) => {
    var rbInfo = rapier.RigidBodyDesc.dynamic().setTranslation(pos.x, pos.y, pos.z)
    var rb = world.createRigidBody(rbInfo);
    var angle = eulerToQuaternion(quat.x, quat.y, quat.z)
    var rbColliderInfo = rapier.ColliderDesc.cuboid(scale.x / 2, scale.y / 2, scale.z / 2).setRotation({ w: angle.w, x: angle.x, y: angle.y, z: angle.z }).setActiveEvents(rapier.ActiveEvents.COLLISION_EVENTS);
    var rbCollider = world.createCollider(rbColliderInfo, rb);

    obj.userData.physicsBody = rb
    rigidBodies.push(obj);

    return rb
}

var d

const DynamicSphere = (obj, pos, radius, quat, mass) => {
    var rbInfo = rapier.RigidBodyDesc.dynamic().setTranslation(pos.x, pos.y, pos.z);
    var rb = world.createRigidBody(rbInfo);
    var angle = eulerToQuaternion(quat.x, quat.y, quat.z)
    var rbColliderInfo = rapier.ColliderDesc.ball(radius).setRotation({ w: angle.w, x: angle.x, y: angle.y, z: angle.z }).setActiveEvents(rapier.ActiveEvents.COLLISION_EVENTS).setRestitution(0.7).setRestitutionCombineRule(rapier.CoefficientCombineRule.Average);;
    var rbCollider = world.createCollider(rbColliderInfo, rb);

    obj.userData.physicsBody = rb
    rigidBodies.push(obj);
    d = obj
    return rb
}

const Impulse = (obj, vec) => {
    obj.userData.physicsBody.applyImpulse(vec, true);
}

var collisionarray;

const CheckCollision = (array) => {
    collisionarray = array
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
        for (let i = 0; i < array.length; i++) {
            if ((array[i][0].userData.physicsBody.handle == handle1 && array[i][1].handle == handle2) || (array[i][0].userData.physicsBody.handle == handle2 && array[i][1].handle == handle1)) {
                array[i][2] = true
            } else {
                array[i][2] = false
            }
        }

    })
}

const Contact = (obj1, obj2) => {
    for (let i = 0; i < collisionarray.length; i++) {
        if (obj1 === collisionarray[i][0] && obj2 === collisionarray[i][1]) {
            return collisionarray[i][2]
        }
    }
}

const KinematicMove = (obj, pos) => {
    obj.userData.physicsBody.setNextKinematicTranslation({ x: pos.x, y: pos.y, z: pos.z })
}

const updatePhysics = () => {
    // Ste the simulation forward.  
    world.step(eventQueue);

    for (let i = 0; i < rigidBodies.length; i++) {
        let obj = rigidBodies[i];
        let objRapier = rigidBodies[i].userData.physicsBody;
        let position = objRapier.translation();
        let rotation = objRapier.rotation();
        obj.position.set(position.x, position.y, position.z);
        obj.rotation.set(rotation.x, rotation.y, rotation.z);
    }
}

// DEGREES TO QUATERNIONS CONVERTER

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function eulerToQuaternion(alpha, beta, gamma) {
    // Convert Euler angles to radians
    var alphaRad = degreesToRadians(alpha);
    var betaRad = degreesToRadians(beta);
    var gammaRad = degreesToRadians(gamma);

    // Compute quaternion components
    var qx =
        Math.sin(alphaRad / 2) * Math.cos(betaRad / 2) * Math.cos(gammaRad / 2) -
        Math.cos(alphaRad / 2) * Math.sin(betaRad / 2) * Math.sin(gammaRad / 2);
    var qy =
        Math.cos(alphaRad / 2) * Math.sin(betaRad / 2) * Math.cos(gammaRad / 2) +
        Math.sin(alphaRad / 2) * Math.cos(betaRad / 2) * Math.sin(gammaRad / 2);
    var qz =
        Math.cos(alphaRad / 2) * Math.cos(betaRad / 2) * Math.sin(gammaRad / 2) +
        Math.sin(alphaRad / 2) * Math.sin(betaRad / 2) * Math.cos(gammaRad / 2);
    var qw =
        Math.cos(alphaRad / 2) * Math.cos(betaRad / 2) * Math.cos(gammaRad / 2) -
        Math.sin(alphaRad / 2) * Math.sin(betaRad / 2) * Math.sin(gammaRad / 2);

    // Normalize quaternion
    var magnitude = Math.sqrt(qw * qw + qx * qx + qy * qy + qz * qz);
    var qxNormalized = qx / magnitude;
    var qyNormalized = qy / magnitude;
    var qzNormalized = qz / magnitude;
    var qwNormalized = qw / magnitude;

    // Return the quaternion as an object
    return {
        x: qxNormalized,
        y: qyNormalized,
        z: qzNormalized,
        w: qwNormalized,
    };
}