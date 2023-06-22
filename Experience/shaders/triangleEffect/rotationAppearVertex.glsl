float prog = (position.y + 1.0)/2.0;
float locprog = clamp((progress - 0.8 * prog)/0.2, 0.0, 1.0);

transformed = transformed - aCenter;
transformed *= locprog;  
transformed += aCenter;

transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), aRandom * (1.0 - progress) *3.14 * 3.0 );