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
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
    <span>  Selected: {{ selected }}</span>
    <ul id="list_rects">
      <li v-for="(item, index) in rects" v-bind:key="item">
        {{ index }} - {{ item[4] }} - {{ item.slice(0,4) }}
      </li>
    </ul>
    <button @click = "popBox" class="btn danger">DELETE</button>

  </div>
</template>

<script>
import firebase from '../firebase';
export default {
  data(){
    return{
      isDrawing: false, 
      canvas: null,
      context: null,
      x:0,
      y:0,
      last_x:0,
      last_y:0,
      image_src: '',
      scale:1,
      // rects format is [x_start, y_start, distance_from_start(x), distance_from_start(y)]
      rects: [],
      selected: 'unselected'
    }
  },
  mounted() {
    let vm = this
    vm.canvas = vm.$refs.canvas
    vm.context = vm.canvas.getContext('2d');
    vm.canvas.addEventListener('mousedown',vm.mousedown);
    vm.canvas.addEventListener('mousemove',vm.mousemove);
    document.addEventListener('mouseup',vm.mouseup)
    // vm.image_src = require('@/assets/000000.jpg')
    let storageRef = firebase.storage().ref();
    // vm.image_src = storageRef.child("waste_image/000003.jpg").getMetadata().getDownloadUrl().toString();
    storageRef.child("waste_images/000002.jpg").getDownloadURL().then(URL => {
      vm.image_src =  URL
      let img = new Image()
      img.src = vm.image_src
      img.onload = function(){
      vm.canvas.width = this.width/vm.scale
      vm.canvas.height = this.height/vm.scale
    }
    })
  },
  methods: {
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
        var i;
        for (i = 0; i < vm.rects.length; i++) {
          vm.context.beginPath();
          let box = vm.rects[i]
          vm.context.rect(box[0],box[1],box[2],box[3]);
          vm.context.strokeStyle = "rgba(0,0,0,1)";
          vm.context.lineWidth = 2;
          vm.context.stroke();
        }
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
      vm.context.beginPath();
      var i;
      for (i = 0; i < vm.rects.length; i++) {
        let box = vm.rects[i]
        vm.context.rect(box[0],box[1],box[2],box[3]);
      }
      vm.context.strokeStyle = "rgba(0,0,0,1)";
      vm.context.lineWidth = 2;
      vm.context.stroke();   
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
      var i;
      for (i = 0; i < vm.rects.length; i++) {
        let box = vm.rects[i]
        vm.context.rect(box[0],box[1],box[2],box[3]);
      }
      vm.context.strokeStyle = "rgba(0,0,0,1)";
      vm.context.lineWidth = 2;
      vm.context.stroke();
      //
    },
    clearBox: function(){
      let vm = this
      vm.x = 0;
      vm.y = 0;
      vm.last_x = 0;
      vm.last_y = 0;
      vm.context.clearRect(0,0,vm.canvas.width,vm.canvas.height);
      vm.context.beginPath();
      var i;
      for (i = 0; i < vm.rects.length; i++) {
        let box = vm.rects[i]
        vm.context.rect(box[0],box[1],box[2],box[3]);
      }
      vm.context.strokeStyle = "rgba(0,0,0,1)";
      vm.context.lineWidth = 2;
      vm.context.stroke();
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
.success {color: green;}
.info {color: dodgerblue;}
.warning {color: orange;}
.danger {color: red;}
.btn:hover {background: #eee;}
.btn_clear:hover {background: #eee;}
</style>