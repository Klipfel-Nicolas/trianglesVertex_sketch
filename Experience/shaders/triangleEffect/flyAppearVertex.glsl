transformed = transformed - aCenter;
transformed *= progress;
transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), aRandom * (1.0 - progress) *3.14 * 20.0 );
transformed += aCenter;