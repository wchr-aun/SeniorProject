<template>
  <div class="container">
    <div v-bind:style="{display: firstState? 'inline-block' : 'none'}" style="background-color: black; height:400px; width:250px; vertical-align: middle; margin: 20px;" >
        
    </div>
    <image-uploader
        :debug="1"
        capture="false"
        :maxWidth="800"
        :maxHeight="800"
        :quality="0.9"
        :autoRotate=true
        outputFormat="verbose"
        :preview= true
        :className="['fileinput', { 'fileinput--loaded' : hasImage }]"
        accept="video/*,image/*"
        doNotResize="['gif', 'svg']"
        @input="setImage"
    >
        <label for="fileInput" slot="upload-label" v-bind:style="{display: isUpload? 'none' : 'inline'}">
          <figure>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 32 32"
            >
              <path
                class="path1"
                d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
              ></path>
            </svg>
          </figure>
          <span class="upload-caption">{{
            hasImage ? "Replace" : "Click to upload"
          }}</span>
        </label>
    </image-uploader>
    <div v-if="image!=null">
        <div style="position: absolute; vertical-align: middlel; left: 50%">
        <progress-bar
        :options="options"
        :value="uploadValue"
        style="position: relative; left:-154px"/>
        </div>
        <br>
        <button @click="onUpload">Upload</button>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase';
let axios = require('axios');

export default {
  name: 'Upload',
  data(){
	return{
        firstState:true,
        uploadValue: 0,
        isUpload: null,
        hasImage: null,
        image: null,
        options: {
        text: {
            color: '#FFFFFF',   
            shadowEnable: true,
            shadowColor: '#000000',
            fontSize: 14,
            fontFamily: 'Helvetica',
            dynamicPosition: false,
            hideText: false
        },
        progress: {
            color: '#2dbd2d',
            backgroundColor: '#333333'
        },
        layout: {
            height: 20,
            width: 300,
            verticalTextAlign: 70,
            horizontalTextAlign: 86,
            zeroOffset: -82,
            strokeWidth: 10,
            progressPadding: 0,
            type: 'line'
        }
        }
	}
  },
  methods:{
    setImage(file){
        this.uploadValue = 0
        this.firstState = false
        this.hasImage = true
        this.image = file
        console.log(file.dataUrl)
    },
    onUpload(){
      if(this.hasImage){
        this.uploadValue = 28
        this.isUpload = true
        axios.post('https://asia-east2-formal-purpose-262413.cloudfunctions.net/uploadImageAnn', this.image.dataUrl).then(response =>{
              if(response.data){
                console.log(response.data)
                this.uploadValue = 100
                this.isUpload = false
                this.hasImage = false
              }
          });
        }
        // let randomName = Array(20).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
        // const storageRef=firebase.storage().ref("waste_images/"+randomName+".jpg").put(this.image);
        // storageRef.on(`state_changed`,snapshot=>{
        //     this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        // }, error=>{console.log(error.message)},
        // ()=>{this.uploadValue=100;}
        // );
    }

  }
}
</script>
<style>
#fileInput {
  display: none;
}
.my-8 {
  margin-top: 4rem;
  margin-bottom: 4rem;
}
</style>