import { myAPI } from './config.js';

const generateForm=document.querySelector(".generate-form");
const imageGallery=document.querySelector(".image-gallery");

let isImageGenerating=false;
const updateImagecard=(imageDataArray)=>{
    imageDataArray.forEach((imgObject,index)=>{
        const imageCard=imageGallery.querySelectorAll(".img-card")[index];
        const imageElement=imageCard.querySelector("img");
        const downloadBtn=imageCard.querySelector(".download-btn");
        //set thr image element src to the ai generated image
        const aiGeneratedImage=`data:image/jpeg;base64,${imgObject.b64_json}`;
        //when the image is loaded remove the loading class and download attributes
        imageElement.src=aiGeneratedImage;
        imageElement.onload=()=>{
            imageCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGeneratedImage);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
            
        }
    });
}
const generateAiImages=async(userPrompt,userImageQuantity)=>{
    //send a request to open AI API
try{
    const response=await fetch("https://api.openai.com/v1/images/generations",{
        method:"POST",
        headers:{
           "Content-Type": "application/json",
           Authorization: `Bearer ${myAPI}`
        },
        body:JSON.stringify({
            prompt:userPrompt,
            n:parseInt(userImageQuantity),
            size:"512x512",
            response_format:"b64_json",

        })
    });
    if(!response.ok) throw new Error("Failed to generate the new images !!Please try again");
    const {data}=await response.json();   //get data from the response

    updateImagecard([...data]);
}
catch(error)
{
 alert(error.message);
}
finally{
    isImageGenerating=false;
}
}
const handleFormSubmission=(e)=>{
e.preventDefault() //prevents from submiiting empty form
if(isImageGenerating)
return;
isImageGenerating=true;
const userPrompt=e.srcElement[0].value;
const userImageQuantity=e.srcElement[1].value;
//creating HTML markup for loading state
const imageCardMarkup=Array.from({length:userImageQuantity},()=>
    ` <div class="img-card loading" >
    <img src="images/loader.svg" alt="image">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download-icon">

    </a>
</div>`

).join("");
imageGallery.innerHTML=imageCardMarkup;
generateAiImages(userPrompt,userImageQuantity);
}
generateForm.addEventListener('submit',handleFormSubmission);