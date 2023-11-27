// AIzaSyAt76R-8N92HSg4Iy0XS0VnJKdwIorDa0U
// "AIzaSyDNhPoz2TI3nPZC59vJAVeGZcbiwzn2mso"
let apikey ="AIzaSyDNhPoz2TI3nPZC59vJAVeGZcbiwzn2mso" ;
let baseurl = "https://www.googleapis.com/youtube/v3";

const searchbutton = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
let videocontainer=document.getElementById("displaydata");

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
function formatLikes(noOfLikes) {
    if(noOfLikes==undefined)
    {
        return "0";
    }
    if (noOfLikes < 1000) {
        return noOfLikes.toString();
    } else if (noOfLikes < 1000000) {
        return Math.floor(noOfLikes / 1000) + 'k';
    } else if (noOfLikes < 1000000000) {
        return Math.floor(noOfLikes / 1000000) + ' million';
    } else {
        return Math.floor(noOfLikes / 1000000000) + ' billion';
    }
}
function formatViews(noOfViews) {
    console.log(noOfViews);
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
// function playVideo(videoId) {
//     const player = new YT.Player(`player-${videoId}`, {
//         height: '200',
//         width: '300',
//         videoId: videoId,
      
//         playerVars: {
//             controls: 0, 
//         },
//     });
// }


// function stopVideo(videoId) {
//     // const player = new YT.Player(`player-${videoId}`);
//     // player.stopVideo();
//         // Ensure that the player is ready before trying to stop it
//         const player = new YT.Player(`player-${videoId}`, {
//             events: {
//                 'onReady': function (event) {
//                     event.target.stopVideo();
//                 }
//             }
//         });



// }
let allvideodataTodisplay;
function navigateTosecondpage(element)
{
    console.log(element.id);
    localStorage.setItem("IdOfDispalyVideo",element.id);
    localStorage.setItem("allVideos",JSON.stringify(allvideodataTodisplay));
    window.location.href="secondpage.html";
}
function renderVideos(videosList) {
    videocontainer.innerHTML="";
  for(let i = 0; i < videosList.length; i++) {
    let videoinfo = videosList[i];
    let div = document.createElement("div");
    div.classList = "card";
    // onmouseout="stopVideo('${videoinfo.id.videoId}')" onmouseover="playVideo('${videoinfo.id.videoId}')"
    div.innerHTML = `<div   onclick="navigateTosecondpage(this)";  id="${videoinfo.id.videoId}" style="background-image: url(${videoinfo.snippet.thumbnails.high.url}); background-position: center; background-size: cover; color: white; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;" >
        <span id="time" style="margin:8px">${convertISO8601ToYouTubeFormat(videoinfo.durationOfvideo)}</span>
    </div>
    <div style="display:flex;gap:0.5rem;align-items:center;">
        <img src="${videoinfo.channellog}" id="req">
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
            <p id="tittle">${videoinfo.snippet.title}</p>
            <p id="channelName">${videoinfo.snippet.channelTitle}</p>
            <p id="viewsAndpostedTime">${formatViews(videoinfo.statastics.viewCount)} Views .${calculateThetimeGap(videoinfo.snippet.publishTime)}</p>
        </div>
    </div>`;
    videocontainer.appendChild(div);
  }
}
async function getvideoStats(videoid)
{
    let endpoint=`${baseurl}/videos?part=statistics&id=${videoid}&key=${apikey}`
    try{
        let response=await fetch(endpoint);
        let data=await response.json();
        console.log(data);
        return data.items[0].statistics;
    }catch(error){
         console.log(error);
    }
}
async function getChannelLogo(channelId)
{

    let endpoint=`${baseurl}/activities?part=snippet&channelId=${channelId}&key=${apikey}`
    try{
          let respone=await fetch(endpoint);
          let data=await respone.json();
          return data.items[0].snippet.thumbnails.default.url;
    }catch(error)
    {
        console.log(error);
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
async function getvideoduration(videoid)
{
    let endpoint=`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoid}&key=${apikey}`;
   
    try{
        let respone=await fetch(endpoint);
        let data=await respone.json();

        return data.items[0].contentDetails.duration;
    }catch(error)
    {
        console.log(error);
    }
    
}
async function getcomments(videoid)
{

    const endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoid}&key=${apikey}`;

    try{
        let respone=await fetch(endpoint);
        let data=await respone.json();
        console.log(data);
    }catch(error)
    {
        console.log(error);
    }
}
async function fetchSearchResults(searchString) {
  const endpoint = `${baseurl}/search?key=${apikey}&q=${searchString}&part=snippet&maxResults=25`;
  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    for(let i=0;i<result.items.length;i++)
    {
        let currentvideoid=result.items[i].id.videoId;
        let channelId=result.items[i].snippet.channelId;
        let videostats=await getvideoStats(currentvideoid);
        let channelLogo=await getChannelLogo(channelId);
        let videoduration=await getvideoduration(currentvideoid);
        // let comments=await getcomments(currentvideoid);
        if(videostats==undefined)
        {
            videostats={       
                    commentCount: "65881",
                    favoriteCount: "0",
                    likeCount: "524523",
                    viewCount: "5909899"
            }
        }
        result.items[i].statastics=videostats;
        result.items[i].channellog=channelLogo;
        result.items[i].durationOfvideo=videoduration;
        // result.items[i].comments=comments;
    }
    allvideodataTodisplay=result.items;
    renderVideos(result.items);
  } catch(error) {
    console.error(error);
  }
}
searchbutton.addEventListener("click", () => {
    
  const searchvalue = searchInput.value;
  fetchSearchResults(searchvalue);
});
fetchSearchResults("");

