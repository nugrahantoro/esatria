/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        /* back btn */
        document.addEventListener("backbutton", onBackKeyDown, false);

        document.getElementById("openfile").addEventListener("click", function(){

        }); 
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

};

app.initialize();

document.addEventListener("deviceready", function() {
    document.addEventListener("backbutton", onBackKeyDown, false);
});

// FUNCTION CAMERA AND OPEN GALLERY
function setOptions() {
    var srcType   = Camera.PictureSourceType.PHOTOLIBRARY;
    var mediaType = Camera.MediaType.ALLMEDIA;
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        targetWidth:1000,
        targetHeight:800,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        // encodingType: Camera.EncodingType.JPEG,
        // mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

// function options_up() {
//     var srcType   = Camera.PictureSourceType.PHOTOLIBRARY;
//     var mediaType = Camera.MediaType.ALLMEDIA;
//     var options = {
//         // Some common settings are 20, 50, and 100
//         quality: 100,
//         targetWidth:1000,
//         targetHeight:800,
//         destinationType: Camera.DestinationType.FILE_URI,
//         // In this app, dynamically set the picture source, Camera or photo gallery
//         sourceType: srcType,
//         encodingType: Camera.EncodingType.JPEG,
//         mediaType: Camera.MediaType.PICTURE,
//         correctOrientation: true  //Corrects Android orientation quirks
//     }
//     return options;
// }

function onFail(message) {
    alert('Gagal : tidak ada file dipilih!');
}