
console.log("x")

function setAttributes(elem, props){
    console.log("props", props);
    for (const [prop, val] of Object.entries(props)){

        console.log(prop, val)
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

    translate(x, y, z){
        this.transform.div.setAttribute("translation", `${x} ${y} ${z}`);
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