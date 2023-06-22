float prog = (position.y + 10.0)/2.0;
float locprog = clamp((progress - 0.8 * prog)/0.2, 0.0, 1.0);

locprog = progress;

transformed = transformed - aCenter;
transformed += 10. * normal * aRandom * (locprog);

transformed *=(1.0 - locprog);

transformed += aCenter;
transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), aRandom * (locprog) *3.14 * 4.0 );