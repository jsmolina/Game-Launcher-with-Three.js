
    // Class scene object
    export class SceneObject {
        name = '';
        id;
        focus = false;
        mesh;
        constructor(name) {
            this.name = name;
            this.id = 0;
            this.focus = false;
        }	

        isFocused(){
            return this.focus;
        }
    }
