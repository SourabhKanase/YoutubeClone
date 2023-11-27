let apikey ="AIzaSyBgt5g4EKUysC66fmG2dVZQyg6j0LiToGE" ;
let videoId=localStorage.getItem("IdOfDispalyVideo");
console.log(videoId);
let cardsdiv=document.getElementById("sidecards");
let videosToDisplay=JSON.parse(localStorage.getItem("allVideos"));
console.log(videosToDisplay);

let requiredvideoinfo;
for(let i=0;i<videosToDisplay.length;i++)
{
    if(videosToDisplay[i].id.videoId==videoId)
    {
        requiredvideoinfo=videosToDisplay[i];
    }else{
        sidecards(videosToDisplay[i]);
    }
}
document.getElementById("channallog").innerHTML=`<img src="${requiredvideoinfo.channellog}" style="width:45px;height:45px;border-radius:25px;">`;
document.getElementById("channelname").innerText=`${requiredvideoinfo.snippet.channelTitle}`;
console.log(requiredvideoinfo);
document.getElementById("videoTittle").innerText=`${requiredvideoinfo.snippet.title}`
document.getElementById("noofviews").innerText=`${requiredvideoinfo.statastics.viewCount} views`;
document.getElementById("nooflikes").innerText=`${requiredvideoinfo.statastics.likeCount}`;
document.getElementById("noofcomments").innerText=`${requiredvideoinfo.statastics.commentCount} Comments`

function onYouTubeIframeAPIReady() {
    display(requiredvideoinfo.id.videoId);
}
function display(videoId)
{    
    console.log(videoId);
    new YT.Player("displayVideo", {
                height: '500',
                width: '910',
                videoId: videoId,
                playerVars: {
                    controls: 1, 
                    autoplay: 1,
                },
            });
}
async function getcomments(videoId)
{
    const endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apikey}&maxResults=50`;

    try{
        let respone=await fetch(endpoint);
        let data=await respone.json();
        console.log(data);
       return data.items;
    }catch(error)
    {
        console.log(error);
    }
}
function formatSubscriberCount(subscriberCount) {
    if(subscriberCount== undefined)
    {
       return "No Subscriber";
    }
    if (subscriberCount < 1000) {
        return subscriberCount + " subscribers";
    } else if (subscriberCount < 1000000) {
        return (subscriberCount / 1000).toFixed(1) + "K subscribers";
    } else {
        return (subscriberCount / 1000000).toFixed(1) + "M subscribers";
    }
}
async function gettingchanneldetails(channelId)
{
    let endpoint=`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apikey}`
     
    try{
        let respone=await fetch(endpoint);
        let data=await respone.json();
       return formatSubscriberCount(data.items[0].statistics.subscriberCount);
        // return formatSubscriberCount(data.items[0].statastics.subscriberCount);
    }catch(error)
    {
        console.log(error);
    }

}
async function callinggettingcomment()
{
       let data= await getcomments(videoId);
       let channelInfo=await gettingchanneldetails(requiredvideoinfo.snippet.channelId);
       document.getElementById("noofsubscriber").innerText=`${channelInfo}`;
       displaycomments(data);
}
callinggettingcomment();

function calculateThetimeGap(publishtime) {
    let publishdate = new Date(publishtime);
    let currentDate = new Date();
  
    let secondsGap = (currentDate.getTime() - publishdate.getTime()) / 1000;
  
    const secondsperday = 24 * 60 * 60;
    const secondsperweek = secondsperday * 7;
    const secondspermonth = 30 * secondsperday;
    const secondsperyear = 365 * secondsperday;
  
    if (secondsGap < secondsperday) {
      return `${Math.ceil(secondsGap / (60 * 60))} hrs ago`;
    }
    if (secondsGap < secondsperweek) {
      return `${Math.ceil(secondsGap / secondsperweek)} weeks ago`;
    }
    if (secondsGap < secondspermonth) {
      return `${Math.ceil(secondsGap / secondspermonth)} months ago`;
    }
    return `${Math.ceil(secondsGap / secondsperyear)} years ago`;
}

function displaycomments(data)
{
    for(let i=0;i<data.length;i++)
    {
        let requiredcommentdetails=data[i];
        let div=document.createElement("div");
        div.className="commentcard";
        div.innerHTML=`
        <div id="profileofuser">
            <img src="${requiredcommentdetails.snippet.topLevelComment.snippet.authorProfileImageUrl}" style="width:45px;height:45px;border-radius:25px;">
        </div>
        <div id="user">
            <div style="display:flex;gap:1rem;">
                <span id="username">${requiredcommentdetails.snippet.topLevelComment.snippet.authorDisplayName}</span>
                <span id="timeofcomment">${calculateThetimeGap(requiredcommentdetails.snippet.topLevelComment.snippet.updatedAt)}</span>
            </div>
            <div id="displaytext">
                ${requiredcommentdetails.snippet.topLevelComment.snippet.textOriginal}
            </div>
            <div id="abc" style="display:flex;align-items:center;gap:0.5rem;">
              <span class="material-symbols-outlined">thumb_up</span>
              <p id="Nooflikes">${requiredcommentdetails.snippet.topLevelComment.snippet.likeCount}</p>
              <p>REPLY</p>
            </div>
        </div>
          `
        document.getElementById("commentsdiv").appendChild(div);
    }
}
function formatViews(noOfViews) {
    if(noOfViews==undefined)
    {
        return "0";
    }
    if (noOfViews < 1000) {
        return noOfViews.toString();
    } else if (noOfViews < 1000000) {
        return Math.floor(noOfViews / 1000) + 'k';
    } else if (noOfViews < 1000000000) {
        return Math.floor(noOfViews / 1000000) + ' million';
    } else {
        return Math.floor(noOfViews / 1000000000) + ' billion';
    }
}
function convertISO8601ToYouTubeFormat(isoDuration) {
    if(isoDuration==undefined)
    {
        return "0";
    }
    const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(durationRegex);

    if (!matches) {
        return "Invalid Duration";
    }

    const hours = matches[1] ? parseInt(matches[1], 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
    const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

    if (hours > 0 || minutes > 0 || seconds > 0) {
        const formattedDuration = [];

        if (hours > 0) {
            formattedDuration.push(`${hours}:`);
        }

        formattedDuration.push(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        
        return formattedDuration.join('');
    } else {
        return "0"; // If the duration is 0 seconds
    }
}
function redirectwithnewvideo(element)
{
     let id=element.id;
     console.log(id);
     localStorage.setItem("IdOfDispalyVideo",id);
    localStorage.setItem("allVideos",JSON.stringify(videosToDisplay));
    window.location.href="secondpage.html";

}
function sidecards(videoinfo)
{
    // for(let i=0;i<arrayofcards.length;i++)
    // {
    //     let cardinfo=arrayofcards[i];
    // }
   let div=document.createElement("div");
   div.className="carddiv"; 
   div.innerHTML=`
   <div  id="${videoinfo.id.videoId}" ; onclick="redirectwithnewvideo(this)"; style="background-image: url(${videoinfo.snippet.thumbnails.high.url}); background-position: center; background-size: cover; color: white; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;min-width:200px;min-height:150px" >
   <span id="time" style="margin:8px">${convertISO8601ToYouTubeFormat(videoinfo.durationOfvideo)}</span>
    </div>
    <div style="display: flex;gap:0.5rem;justify-content:space-between;align-items:center;">
    <div style="display: flex; flex-direction: column; justify-content: space-between;">
        <p id="tittle">${videoinfo.snippet.title}</p>
        <p id="channelName">${videoinfo.snippet.channelTitle}</p>
        <p id="viewsAndpostedTime">${formatViews(videoinfo.statastics.viewCount)} Views .${calculateThetimeGap(videoinfo.snippet.publishTime)}</p>
    </div>
    </div>
   `
   cardsdiv.appendChild(div);
}

