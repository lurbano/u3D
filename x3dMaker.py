
class v: # vertex
    def __init__(self, x,y,z):
        self.x = x
        self.y = y
        self.z = z
    def __str__(self):
        return f"v {self.x} {self.y} {self.z}"

class uFace: # face
    def __init__(self, vertices = [], title="", material = ""):
        self.vertices = vertices
        self.material = material
        self.title = title
        faces.append(self)

    def extrude(self, x, y, z):
        # print("EXTRUDING")
        # opposite face
        vs = []
        for vtx in self.vertices:
            vs.append(v(vtx.x+x, vtx.y+y, vtx.z+z))
        opFace = uFace(vs,f"opp {self.title}",self.material)
        # print(opFace)

        # edges
        n = len(self.vertices)
        for i in range(-1, n-1):
            vs = [  self.vertices[i],
                    self.vertices[i+1],
                    opFace.vertices[i+1],
                    opFace.vertices[i]
                 ]
            edgeFace = uFace(vs, f'{i}_edge_{self.title}', self.material)



    def __str__(self):
        s = f"# {self.title}\n"
        fseq = f"usemtl {self.material}\nf"
        n = -len(self.vertices) - 1
        for v in self.vertices:
            s += str(v) + '\n'
            n += 1 
            fseq += f" {n}"
        s += "\n" + fseq + "\n"
        return s

def printObjFile():
    for f in matlibs:
        print (f"mtllib {f}\n")

    # print(leftWall)
    for f in faces:
        print(f)



# material libraries
matlibs = ["stairwell.mtl"]
faces = []

# left wall
vertices = [
      v(0,0,0),
      v(5,0,0),
      v(9,3,0),
      v(11,3,0),
      v(16,6,0),
      v(20,6,0),
      v(20,10,0),
      v(0,10,0)
    ]

leftWall = uFace(vertices, "left Wall", "oceanblue")

leftWall.extrude(0,0,1)

printObjFile()

