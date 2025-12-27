
console.log("x")

function setAttributes(elem, props){
    // console.log("props", props);
    for (const [prop, val] of Object.entries(props)){

        // console.log(prop, val)
        elem.setAttribute(prop, val);
        
    }
}

class ux3d {
    constructor(params={}){
        
        let defaults = {
            width: "400px",
            height: "500px"
        }

        this.params = {...defaults, ...params};

        this.elem = document.createElement("x3d");
        setAttributes(this.elem, this.params);
        this.elem.style.width = this.params.width;
        this.elem.style.height = this.params.height;

        this.scene = new uScene();

        this.elem.appendChild(this.scene.div);

    }

    add(obj){
        this.scene.div.appendChild(obj.assemble());
    }
}

// Note: all objects added need an .assemble() method like box.assemble()

class uScene {
    constructor(params={}){
        let defaults = {
            DEF: "scene",
            description: "startPos",
            render: true,
            visible: true,
            bboxcenter: '0,0,0',
            bboxsize: "-1,-1,-1",
            bboxdisplay: false,
            bboxmargin: "0.01",
            bboxcolor:"1,1,0",
            pickmode:"idBuf",
            dopickpass: true,
            shadowobjectidmapping: ""
        }
        
        this.params = {...defaults, ...params};

        this.div = document.createElement("scene");
        setAttributes(this.div, this.params)

    }

    addTo(id){
        outerDiv = document.getElementById(id);
        outerDiv.appendChild(this.div);
    }
}

class uShape {
    constructor(params={}){
        let defaults = {
            render: true,
            visible: true,
            bboxcenter: '0,0,0',
            bboxsize: "-1,-1,-1",
            bboxdisplay: false,
            bboxmargin: "0.01",
            bboxcolor:"1,1,0",
            ispickable: true,
            idoffset:"0"
        }

        this.params = {...defaults, ...params};

        this.div = document.createElement("shape");
        setAttributes(this.div, this.params)
        
    }

    addTo(id) {
        outerDiv = document.getElementById(id);
        outerDiv.appendChild(this.div);
    }
}


class uAppearance {
    constructor(params={}){
        let defaults = {
            sorttype:"auto",
            sortkey:"0",
            alphaclipthreshold:"0.1"
        }
        this.params = {...defaults, ...params};

        this.div = document.createElement("appearance");
        setAttributes(this.div, this.params);
        // this.material = new uMaterial();
        // this.div.appendChild(this.material.div);
    }

    addTo(id) {
        outerDiv = document.getElementById(id);
        outerDiv.appendChild(this.div);
    }
}

class uMaterial {
    constructor(params={}){
        let defaults = {
            diffusecolor:"1 0 0",
            ambientintensity:"0.2",
            emissivecolor:"0 0 0",
            shininess: "0.2",
            specularcolor: "0,0,0",
            transparency:"0"
        }
        this.params = {...defaults, ...params};

        this.div = document.createElement("material");
        setAttributes(this.div, this.params);
    }

    addTo(id) {
        outerDiv = document.getElementById(id);
        outerDiv.appendChild(this.div);
    }
}

class uPrimitive {
    constructor(params={}, primitiveType="box"){
        let defaults = {}
        this.params = {...defaults, ...params};

        this.div = document.createElement(primitiveType);
        setAttributes(this.div, this.params);
        this.shape = new uShape();
        this.appearance = new uAppearance();
        this.material = new uMaterial();

        this.transform = new uTransform();
    }

    assemble(){
        this.appearance.div.appendChild(this.material.div);
        this.shape.div.appendChild(this.appearance.div);
        this.shape.div.appendChild(this.div);

        this.transform.appendChild(this.shape);

        return this.transform.div;
    }

    setColor(r, g, b){
        r = r/255;
        g = g/255;
        b = b/255;
        this.material.div.setAttribute("diffusecolor", `${r} ${g} ${b}`);
    }

    setEmissiveColor(r, g, b){
        r = r/255;
        g = g/255;
        b = b/255;
        this.material.div.setAttribute("emissiveColor", `${r} ${g} ${b}`);
    }

    translate(x, y, z){
        //this.transform.div.setAttribute("translation", `${x} ${y} ${z}`);
        this.transform.translate(x,y,z);
    }

    rotateAxisAngle(x=0, y=0, z=0, t=0){
        t = t * Math.PI/180
        this.transform.div.setAttribute("rotation", `${x} ${y} ${z} ${t}`);
    }

    rotateX(t=0){
        t = t * Math.PI/180
        
        this.transform.div.setAttribute("rotation", `0 1 0 ${t}`);
    }
    rotateY(t=0){
        t = t * Math.PI/180
        this.transform.div.setAttribute("rotation", `0 0 1 ${t}`);
    }
    rotateZ(t=0){
        t = t * Math.PI/180
        this.transform.div.setAttribute("rotation", `1 0 0 ${t}`);
    }

    rotate(rx=0, ry=0, rz=0){ // angles in degrees for rotation about x-axis, y-axis, and z-axis
        let r = eulerToAxisAngle(rx, ry, rz); 
        let angle = r.angle * 180 / Math.PI;
        let axis = r.axis;
        this.rotateAxisAngle(axis.x, axis.y, axis.z, angle)
    }

    addTexture(fname){
        let div = document.createElement("ImageTexture");
        div.setAttribute("url", fname);
        this.appearance.div.appendChild(div);
    }

    addVideo(fname){
        let div = document.createElement("MovieTexture");
        div.setAttribute("url", fname);
        this.appearance.div.appendChild(div);
    }
}

class uTransform{
    constructor(params={}){
        let defaults ={
            translation: "0 0 0",
            render: true,
            visible: true,
            bboxcenter: "0 0 0",
            bboxmargin: "0.01",
            bboxcolor: "1,1,0",
            center: "0,0,0",
            rotation: "0,0,0,0",
            scale:"1,1,1",
            scaleorientation: "0,0,0,0"
        }
        this.params = {...defaults, ...params};

        this.div = document.createElement("transform");
        setAttributes(this.div, this.params);

    }

    appendChild(uObj){
        this.div.appendChild(uObj.div);
    }

    translate(x,y,z){
        this.div.setAttribute("translation", `${x} ${y} ${z}`);
    }
}


class uAxes {
    constructor(params={}){
        this.axes = new uTransform();
        // this.group = document.createElement("group");
        // this.axes.div.appendChild(this.group);

        this.xAxis = addLine([[0,0,0], [1,0,0]]);
        this.xAxis.setEmissiveColor(255,0,0);
        this.yAxis = addLine([[0,0,0], [0,1,0]]);
        this.yAxis.setEmissiveColor(0,255,0);
        this.zAxis = addLine([[0,0,0], [0,0,1]]);
        this.zAxis.setEmissiveColor(0,0,255);

        this.axes.div.appendChild(this.xAxis.assemble());
        this.axes.div.appendChild(this.yAxis.assemble());
        this.axes.div.appendChild(this.zAxis.assemble());
    }

    assemble(){
        return this.axes.div;
    }

    translate(x,y,z){
        this.axes.translate(x,y,z);
    }

}


function addLine(pts){
    txt = '';
    for (pt of pts){
        console.log(pt);
        const x = pt[0];
        const y = pt[1];
        const z = pt[2];

        txt += `${x},${y},${z} `
    }
    console.log("txt", txt);

    coords = new uCoordinate({
        point: txt
    })
    console.log("line")
    line = new uLine();
    
    line.addCoords(coords)
    line.setVertexCount(pts.length);

    
    return line;
}

class uGroup extends uPrimitive{
    constructor(params={}){
        let defaults = {};
        params = {...defaults, ...params};

        super(params, "group");
    }

    appendChild(uObj){
        this.div.appendChild(uObj.div);
    }
}

class uLine extends uPrimitive{
    constructor(params={}){
        let defaults = {
            solid: true,
            ccw: true,
            usegeocache:"true",
            hashelpercolors: false
        }
        params = {...defaults, ...params};

        super(params, "lineset");
        
    }

    addCoords(uCoord){
        this.coords = uCoord;
        this.div.appendChild(uCoord.div);
    }
    setVertexCount(n){
        this.div.setAttribute("vertexCount", n);
    }
}

class uCoordinate {
    constructor(params={}){
        let defaults = {
            point: "0 0 0  1 0 0"
        }
        this.params = {...defaults, ...params};

        this.div = document.createElement("coordinate");
        setAttributes(this.div, this.params);
        
    }
}

function addBox(x=1,y=1,z=1){
    return new uBox({
        size: `${x} ${y} ${z}`
    })
}

class uBox extends uPrimitive{
    constructor(params={}){
        let defaults = {
            solid: true,
            ccw: true,
            usegeocache:"true",
            size: "2,2,2",
            hashelpercolors: false
        }
        params = {...defaults, ...params};

        super(params, "box");
        
    }
}

class uSphere extends uPrimitive{
    constructor(params={}){
        let defaults = {
            solid: true,
            ccw: true,
            usegeocache:"true",
            lit: true,
            radius: 1.41,
            subdivision: "24,24"
        }
        params = {...defaults, ...params};

        super(params, "sphere");
    }

}

class uCone extends uPrimitive{
    constructor(params={}){
        let defaults = {
            solid: true,
            ccw: true,
            usegeocache:"true",
            lit: true,
            bottomRadius: 1.5,
            top:true,
            subdivision: "32"
        }
        params = {...defaults, ...params};

        super(params, "cone");
    }

}

class uCylinder extends uPrimitive{
    constructor(params={}){
        let defaults = {
            solid: true,
            ccw: true,
            usegeocache:"true",
            lit: true,
            radius: 1,
            height: 2,
            top:true,
            bottom:true,
            side:true,
            subdivision: "32"
        }
        params = {...defaults, ...params};

        super(params, "cylinder");
    }

}


class uViewpoint{
    constructor(params={}){
        let defaults = {
            //bind: false,
            position: "0. 0. 10.",
            orientation: "0. 0. 0. 0.",
            centerOfRotation: "0. 0. 0.",
            fieldOfView:"0.78540"
        }
        this.params = {...defaults, ...params};
        this.div = document.createElement('viewpoint');
        setAttributes(this.div, this.params);
        //this.div.setAttribute("id", "viewpointTest");
        
    }

    assemble(){
        console.log('viewpoint:', this.div)
        return this.div;
    }

    bind(){
        console.log('reset view')
        console.log(this.div);
        //this.div.setAttribute("bind", 'true');
        this.div.setAttribute('set_bind','true');
        console.log("bind", this.div);
    }
}



function eulerToAxisAngle(rx, ry, rz) {
    //adapted from chatGPT

  rx = rx * Math.PI/180;
  ry = ry * Math.PI/180;
  rz = rz * Math.PI/180;
  // Step 1: compute rotation matrix from Euler angles (X → Y → Z)
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);

  // Rotation matrix R = Rz * Ry * Rx
  const m00 = cz * cy;
  const m01 = cz * sy * sx - sz * cx;
  const m02 = cz * sy * cx + sz * sx;

  const m10 = sz * cy;
  const m11 = sz * sy * sx + cz * cx;
  const m12 = sz * sy * cx - cz * sx;

  const m20 = -sy;
  const m21 = cy * sx;
  const m22 = cy * cx;

  // Step 2: extract axis-angle from rotation matrix
  const trace = m00 + m11 + m22;
  let angle = Math.acos(Math.min(1, Math.max(-1, (trace - 1) / 2)));

  // If angle is very small, return a default axis
  if (angle < 1e-6) {
    return {
      angle: 0,
      axis: { x: 1, y: 0, z: 0 }
    };
  }

  const denom = 2 * Math.sin(angle);

  const x = (m21 - m12) / denom;
  const y = (m02 - m20) / denom;
  const z = (m10 - m01) / denom;

  return {
    angle,
    axis: { x, y, z }
  };
}
