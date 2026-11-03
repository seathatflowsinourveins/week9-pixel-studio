function pixelIndex(x,y,imageWidth) { return 4*(y*imageWidth+x); }
function minuteProgress(now,start) { return Math.max(0,Math.min(1,(now-start)/60000)); }
module.exports={pixelIndex,minuteProgress};
