<template>
  <div>
    <canvas ref="canvas" width="600" height="600" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove" style="cursor: crosshair;border: 1px solid #000000;"></canvas>
    <div>xmin : {{last_x}}</div>
    <div>ymin : {{last_y}}</div>
    <div>xmax : {{x}}</div>
    <div>ymax : {{y}}</div>

  </div>
</template>

<script>
export default {
  data(){
    return{
      isDrawing: false, 
      canvas: null,
      context: null,
      x:0,
      y:0,
      last_x:0,
      last_y:0
    }
  },
  mounted() {
    let vm = this
    vm.canvas = vm.$refs.canvas
    vm.context = vm.canvas.getContext('2d');
    vm.canvas.addEventListener('mousedown',vm.mousedown);
    vm.canvas.addEventListener('mousemove',vm.mousemove);
    document.addEventListener('mouseup',vm.mouseup)
    vm.canvas.height = 600
    vm.canvas.width = 600
  },
  methods: {
    mousedown: function(e){
      let vm = this
      let rect = vm.canvas.getBoundingClientRect();
      let x = parseInt(e.clientX - rect.left);
      let y = parseInt(e.clientY - rect.top);
      console.log(e.clientX)
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
        vm.context.clearRect(0,0,vm.canvas.height,vm.canvas.width);
        vm.context.beginPath();
        // vm.context.rect(10,10,vm.x,vm.y)
        vm.context.rect(vm.last_x,vm.last_y,vm.x-vm.last_x,vm.y-vm.last_y);
        vm.context.strokeStyle = "rgba(0,0,0,1)";
        vm.context.lineWidth = 1;
        vm.context.stroke();
      }
    },
    mouseup: function(e){
      let vm = this
      vm.isDrawing = false;
    }
  }
  
}
</script>
