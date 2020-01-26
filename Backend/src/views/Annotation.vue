<template>
  <div>
    <canvas ref="canvas" width="" height="" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove" v-bind:style="{ backgroundImage: 'url(' + image_src + ')' }" style="cursor: crosshair;border: 1px solid #000000;background-size: contain;"></canvas>
    <div><button @click = "clearBox" class="btn_clear">clear</button></div>
    <div>last_x : {{last_x}}</div>
    <div>last_y : {{last_y}}</div>
    <div>x : {{x}}</div>
    <div>y : {{y}}</div>
    <button @click = "saveBox" class="btn success">SAVE</button>
    <select ref="dropdown" v-model="selected">
      <option disabled value="">Please select one</option>
      <option>PP</option>
      <option>PET</option>
      <option>HDPE</option>
    </select>
    <span>  Selected: {{ selected }}</span>
    <ul id="list_rects">
      <li v-for="(item, index) in rects" v-bind:key="item">
        {{ index }} - {{ item[4] }} - {{ item.slice(0,4) }}
      </li>
    </ul>
    <button @click ="popBox" class="btn danger">DELETE</button>
    <br>
    <button @click="submitAnnotation" class="button">SUBMIT</button>

  </div>
</template>

<script>
import firebase from '../firebase';
let axios = require('axios');
export default {
  data(){
    return{
      collectionID:'',
      filename:'',
      isDrawing: false, 
      canvas: null,
      context: null,
      x:0,
      y:0,
      last_x:0,
      last_y:0,
      image_src: '',
      scale:1,
      // rects format is [x_start, y_start, distance_from_start(x), distance_from_start(y), class]
      rects: [],
      selected: 'unselected'
    }
  },
  mounted() {
    let vm = this
    vm.currentImage = ""
    vm.canvas = vm.$refs.canvas
    vm.context = vm.canvas.getContext('2d');
    vm.canvas.addEventListener('mousedown',vm.mousedown);
    vm.canvas.addEventListener('mousemove',vm.mousemove);
    document.addEventListener('mouseup',vm.mouseup)
    // vm.image_src = require('@/assets/000000.jpg')
    this.getImage()

  },
  methods: {
    end_time: function(startTime){
      let endTime = new Date();
      let timeDiff = endTime - startTime;
      console.log(timeDiff + " ms");
    },
    showDrawedRectangles: function(){
      let vm = this
      vm.context.beginPath();
      let i;
      for (i = 0; i < vm.rects.length; i++) {
        let box = vm.rects[i]
        vm.context.rect(box[0],box[1],box[2],box[3]);
      }
      vm.context.strokeStyle = "rgba(0,0,0,1)";
      vm.context.lineWidth = 2;
      vm.context.stroke();
    },
    mousedown: function(e){
      let vm = this
      let rect = vm.canvas.getBoundingClientRect();
      let x = parseInt(e.clientX - rect.left);
      let y = parseInt(e.clientY - rect.top);
      vm.isDrawing = true;
      vm.last_x = x
      vm.last_y = y
    },
    mousemove: function(e){
      let vm = this
      let rect = vm.canvas.getBoundingClientRect();
      if(vm.isDrawing){
        vm.x = parseInt(e.clientX - rect.left);
        vm.y = parseInt(e.clientY - rect.top);
        vm.context.clearRect(0,0,vm.canvas.width,vm.canvas.height);
        // display rectangles
        this.showDrawedRectangles();
        vm.context.beginPath();
        vm.context.rect(vm.last_x,vm.last_y,vm.x-vm.last_x,vm.y-vm.last_y);
        vm.context.strokeStyle = "rgba(255,255,0,1)";
        vm.context.lineWidth = 2;
        vm.context.stroke();
      }
    },
    mouseup: function(e){
      let vm = this
      vm.isDrawing = false;
    },
    saveBox: function(){
      let vm = this
      let rect = [vm.last_x,vm.last_y,vm.x-vm.last_x,vm.y-vm.last_y,vm.selected]
      if(vm.rects.length == 0 || JSON.stringify(vm.rects[vm.rects.length-1].slice(0,4)) != JSON.stringify(rect.slice(0,4)))
        if(JSON.stringify([0,0,0,0]) != JSON.stringify(rect.slice(0,4)))
          vm.rects.push(rect)
      // display rectangles
      vm.context.clearRect(0,0,vm.canvas.width,vm.canvas.height);
      this.showDrawedRectangles();
    },
    popBox: function(){
      let vm = this
      let amountBeforePop = vm.rects.length
      vm.context.clearRect(0,0,vm.canvas.width,vm.canvas.height);
      if(amountBeforePop == 0){        
        vm.x = 0;
        vm.y = 0;
        vm.last_x = 0;
        vm.last_y = 0;
      }
      else{
        let popBox = vm.rects.pop()
        // if popBox != current 
        if(JSON.stringify([vm.last_x,vm.last_y,vm.x-vm.last_x,vm.y-vm.last_y]) != JSON.stringify(popBox.slice(0,4))){
          // display current rectangle 
          vm.context.beginPath();
          vm.context.rect(vm.last_x,vm.last_y,vm.x-vm.last_x,vm.y-vm.last_y);
          vm.context.strokeStyle = "rgba(255,255,0,1)";
          vm.context.lineWidth = 2;
          vm.context.stroke();
        }
        else{
          vm.x = 0;
          vm.y = 0;
          vm.last_x = 0;
          vm.last_y = 0;
        }
      }
      // display rectangles
      vm.context.beginPath();
      this.showDrawedRectangles();
    },
    clearBox: function(){
      let vm = this
      vm.x = 0;
      vm.y = 0;
      vm.last_x = 0;
      vm.last_y = 0;
      vm.context.clearRect(0,0,vm.canvas.width,vm.canvas.height);
      this.showDrawedRectangles();
    },
    getImage: function(){
      let start_time = new Date();
      let limit_image = 10
      let filenames = new Array();
      let databaseRef = firebase.firestore().collection("waste_images");
      databaseRef.where("isAnnotated", "==", false).limit(limit_image).get().then( snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        console.log("query_")
        this.end_time(start_time);
        snapshot.forEach(doc => {
          filenames.push([doc.id,doc.data().filename])
        });
        // Get an unannotated image
        let randomFilename = filenames[Math.floor(Math.random() * Math.floor(limit_image))]
        this.collectionID = randomFilename[0]
        this.filename = randomFilename[1]
        if(this.filename){
          this.LoadImage(this.filename)
        }else{
          console.log("Undefined filename. left unannotated images less than limit")
        }
      })
      .catch(err => {
      console.log('Error getting documents', err);
      });
    },
    LoadImage: function(filename){
      let start_time = new Date();
      console.log("waste_images/".concat(filename))
      let storageRef = firebase.storage().ref();
      let vm = this
      storageRef.child("waste_images/".concat(filename)).getDownloadURL().then(URL => {
        vm.image_src =  URL
        let img = new Image()
        img.src = vm.image_src
        img.onload = function(){
          vm.canvas.width = this.width/vm.scale
          vm.canvas.height = this.height/vm.scale
      }
      vm.currentImage = filename
      this.end_time(start_time);
    });
    },
    submitAnnotation: function(){
      if(this.rects.length != 0){
        let payload = {
          "annotations": this.rects,
          "filename": this.filename,
          "collectionID": this.collectionID
        }
        console.log(payload)
        axios.post('http://localhost:5000/annotate', payload).then(response =>{
            if(response.data){
              console.log(response.data)
              this.rects = []
              this.getImage()
              this.clearBox()
            }
            else{
              console.log("Upload Failed")
            }
        });
      }
      else{
        console.log("no annotation for upload")
      }
    } 
  }
  
}
</script>

<style>
.btn_clear {
  border: none;
  background-color: inherit;
  padding: 0;
  font-size: 16px;
  display: inline-block;
  color: blue;
}

.btn {
  border: none;
  background-color: inherit;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  display: inline-block;
}
.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 16px 32px;
  text-align: center;
  display: inline;
  font-size: 25px;
  margin: 4px 2px;
  cursor: pointer;
  transition-duration: 0.4s;
}

.button:hover {
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
}
.success {color: green;}
.info {color: dodgerblue;}
.warning {color: orange;}
.danger {color: red;}
.btn:hover {background: #eee;}
.btn_clear:hover {background: #eee;}
</style>