/*
Plane Resolve is a script to find a fourth point based on position of three points

Assumption:

*/

var alpha, beta, gamma, delta;
var A_0, B_0, C_0, D_0, M_0; //initial states
var A, B, C, D, M; //current states
var refFrame = 0;

A = 
B = 
C = 
D = 

//Добавить везде _0
var M = [0,0]; 
M[1] = ((A[1]*(C[0] - A[0])/(C[1] - A[1])) - (B[1]*((D[0] - B[0])/(D[1] - B[1]))) - (A[0] - B[0]))/(((C[0] - A[0])/(C[1] - A[1])) - ((D[0] - B[0])/(D[1] - B[1])));
M[0] = ((M[1] - A[1])/(C[1] - A[1]))*(C[0] - A[0]) + A[0];