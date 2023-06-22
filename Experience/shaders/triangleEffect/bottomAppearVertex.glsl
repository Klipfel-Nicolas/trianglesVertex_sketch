float prog = (position.y + 1.0)/2.0;
float locprog = clamp((progress - 0.8 * prog)/0.2, 0.0, 1.0);

transformed = transformed - aCenter;
transformed *= locprog;  
transformed += aCenter;