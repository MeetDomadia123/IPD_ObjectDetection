export const drawRect = (detections, ctx) =>{
  // Loop through each prediction
  detections.forEach(prediction => {

    // Extract boxes and classes
    const [x, y, width, height] = prediction['bbox']; 
    const text = prediction['class']; 

    console.log(text);
    

    // Set styling
    // const color = Math.floor(Math.random()*16777215).toString(16);
    ctx.strokeStyle = '#ffffff'
    ctx.font = '23px Arial';

    // Draw rectangles and text
    ctx.beginPath();   
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height); 
    ctx.stroke();
  });
}
