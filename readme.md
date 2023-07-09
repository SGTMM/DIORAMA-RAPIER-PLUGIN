# DIORAMA RAPIER PHYSICS PLUGIN

A plugin that adds physics features to the Diorama library. The plugin uses the rapier.js library.

DOCUMENTATION

For file structure, check out one of the examples.

To enable physics use the `setupPhysics()` function in the setup. Then to update physics use `updatePhysics()` in the draw function.

Rigid bodies:

```diff
    fixedBox(pos, scale, rotation)

    pos: {x, y, z}
    scale: {width, height, depth}
    rotation: {x, y, z}
```

Returns a fixed box, that cannot be moved, but has collision with other objects, gravity won't affect it

```diff
    dynamicBox(pos, scale, rotation, mass)

    pos: {x, y, z}
    scale: {width, height, depth}
    rotation: {x, y, z}
    mass: int
```

Returns a dynamic box, that can be moved and has collision with other objects

```diff
    kinematicBox(pos, scale, rotation)

    pos: {x, y, z}
    scale: {width, height, depth}
    rotation: {x, y, z}
```

Returns a kinematic box, that can be moved, but has collision with other objects, gravity won't affect it

```diff
    dynamicSphere(pos, radius, rotation, mass)

    pos: {x, y, z}
    radius: int
    rotation: {x, y, z}
    mass: int
```

Returns a dynamic sphere, that can be moved and has collision with other objects

```diff
    fixedCylinder(pos, radius, height, rotation)

    pos: {x, y, z}
    radius: int
    height: int
    rotation: {x, y, z}
```

Returns a fixed cylinder, that cannot be moved, but has collision with other objects, gravity won't affect it

Keep in mind that you can still use the normal box and sphere functions, though physics won't affect them.

Colliders:

```diff
    boxCollider(pos, scale, rotation, visible)

    pos: {x, y, z}
    scale: {width, height, depth}
    rotation: {x, y, z}
    visible: bool
```

Returns a box collider, that records collisions with other objects, but won't act as an obstacle; gravity won't affect it. If visible is set to true, a box will be shown at its position, but won't count as obstacle.

Collision dectection:

Collision detection is divided into 3 steps:

Step 1:

```diff
    addToCollisionCheck(obj1, obj2)

    obj1: rigidbody
    obj2: collider
```

The obj2 must be a collider, else it won't work. This makes the two bodies able to detect each other when in collision.

Step 2:

```diff
    checkCollision()
```

This must be used in the draw function, since it checks whether objects are colliding.

Step 3:

```diff
    Contact(obj1, obj2)

    obj1: rigidbody
    obj2: collider
```

The obj1 and obj2 are the same used in `addToCollisionCheck`. The function returns true when those two objects collide.

Movement:

```diff
    Impulse(obj, vec)

    obj: rigidbody
    vec: {x, y, z}
```

Applies an impulse to the object provided.
