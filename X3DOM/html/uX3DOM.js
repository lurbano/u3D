
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


class uBox{
    constructor(params={}){
        let defaults = {
            solid: true,
            ccw: true,
            usegeocache:"true",
            size: "2,2,2",
            hashelpercolors: false
        }
        this.params = {...defaults, ...params};

        this.div = document.createElement("box");
        setAttributes(this.div, this.params);
        this.shape = new uShape();
        this.appearance = new uAppearance();
        this.material = new uMaterial();
    }

    assemble(){
        this.appearance.div.appendChild(this.material.div);
        this.shape.div.appendChild(this.appearance.div);
        this.shape.div.appendChild(this.div);
        return this.shape.div;
    }
}

