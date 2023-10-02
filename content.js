console.log("Hi, I have been injected whoopie!!!");
let recorder;

function onAccessApproved(stream){

    let customControls = () => {

        let controlsContainer = document.createElement("div");
        controlsContainer.style.display = "flex";
        controlsContainer.style.zIndex = "99999999";
        controlsContainer.style.gap = "1rem";
        controlsContainer.style.alignItems = "center";
        controlsContainer.style.minWidth = "400px";
        controlsContainer.style.backgroundColor = "#141414";
        controlsContainer.style.borderRadius = "100vh";
        controlsContainer.style.paddingBlock = "0.5rem";
        controlsContainer.style.justifyContent = "space-evenly";
        controlsContainer.style.position = "fixed";
        controlsContainer.style.bottom = "5%";
        controlsContainer.style.left = "5%";
        let time = document.createElement("div");
        let timeP = document.createElement("p");
        let timeSpan = document.createElement("span");
        time.style.display = "flex";
        time.style.alignItems = "center";
        time.style.gap = "1rem";
        timeP.style.fontWeight = "500";
        timeP.style.fontSize = "1.25rem";
        timeP.style.fontFamily = "Inter";
        timeP.style.color = "#fff";
        timeP.textContent = "00:03:35";
        timeSpan.style.height = "8px";
        timeSpan.style.width = "8px";
        timeSpan.style.backgroundColor = "red";
        timeSpan.style.borderRadius = "50%";
        time.appendChild(timeP);
        time.appendChild(timeSpan);
        controlsContainer.appendChild(time);
        let controlItemsContainer = document.createElement("div");
        controlItemsContainer.style.display = "flex";
        controlItemsContainer.style.alignItems = "center";
        controlItemsContainer.style.gap = "1rem";
        controlItemsContainer.style.borderLeft = "1px solid #E8E8E8";
        controlItemsContainer.style.paddingLeft = "1rem";
        document.body.appendChild(controlsContainer);
        const controlItem1 = createControlItem("Pause", '⏸️');
        const controlItem2 = createControlItem("Stop", '⏹️');
        const controlItem3 = createControlItem("Camera", '🎦');
        controlItemsContainer.appendChild(controlItem1);
        controlItemsContainer.appendChild(controlItem2);
        controlItemsContainer.appendChild(controlItem3);
    
        function createControlItem(labelText, icon) {
          const controlItem = document.createElement("div");
          //   controlItem.className = "controlItem";
          controlItem.style.display = "flex";
          controlItem.style.alignItems = "center";
          controlItem.style.gap = ".3rem";
          //   controlItem.style.paddingLeft = "1rem";
          controlItem.style.flexDirection = "column";
          const button = document.createElement("button");
          button.style.borderRadius = "50%";
          button.style.display = "grid";
          button.style.placeContent = "center";
          button.style.backgroundColor = "#fff";
          button.style.border = "none";
          button.style.height = "30px";
          button.style.width = "30px";
          const img = document.createElement("div");
          img.style.height = "15px";
          img.style.width = "15px";
          img.textContent = icon;
          button.appendChild(img);
          const label = document.createElement("small");
          label.style.fontFamily = "Work Sans";
          label.style.fontWeight = "500";
          label.style.fontSize = "0.75rem";
          label.style.color = "#fff";
          label.textContent = labelText;
          controlItem.appendChild(button);
          controlItem.appendChild(label);
          return controlItem;
        }
        controlsContainer.appendChild(controlItemsContainer);
    }




    recorder = new MediaRecorder(stream);
    // recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    
    let data = [];

    // console.log({"videoChunks": videoChunks});
    recorder.start(1000);

    //Call the custom controls function
    customControls();


    recorder.onstop = function(){
        customControls("hide");
        stream.getTracks().forEach(function(track){
            if(track.readyState === "live"){
                track.stop();
            }
        })
    }





    




    recorder.ondataavailable = (event) => {
        data.push(event.data);


        console.log({"data-chunks": data});
        // console.log({"video-chunks": videoChunks,"audio-chunks": audioChunks, "data": data});
        let recordedBlob = event.data;
        // sendChunkToBackend(recordedBlob);
        console.log("recordedBlob has been assigned")
        console.log(recordedBlob);

;

        // const blob = new Blob(data, { type: 'video/webm' });

        // window.open(URL.createObjectURL(blob), '_blank');
        // Clear state ready for next recording
        recorder = undefined;
        // data = [];
    }
}



function sendChunkToBackend(blob) {
    const formData = new FormData();

    // const bufferData = Buffer.from(blob, 'utf-8');
    // const base64Encoded = bufferData.toString(base64);

    formData.append('file', blob, 'screen-recording.webm');
    fetch('https://example.com/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log({'Chunk sent successfully': data});
    })
    .catch(error => {
      console.error({'Error sending chunk': error});
    });
}



chrome.runtime.onMessage.addListener( (message, sender, sendResponse)=>{

    if(message.action === "request_recording"){
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio:true,
            video: {
                width:9999999999,
                height: 9999999999
            }
        }).then((stream)=>{
            onAccessApproved(stream)
        })  
    }

    if(message.action === "stopvideo"){
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if(!recorder) return console.log("no recorder")

        recorder.stop();


    }

});