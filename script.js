let currentSong=new Audio()
let folder="songs/newFriday/"

function secondsToMinutesSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    var formattedTime = minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
    return formattedTime;
}

async function getSongs(folder){
    folder=folder
    let a=await fetch(`http://127.0.0.1:5500/Project%20Spotify/${folder}`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    var songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)
        }
    }

    let songUL=document.querySelector(".songList").getElementsByTagName("ol")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+ `<li>
        <div class="music"><i class="fa-solid fa-music"></i></div>
        <div class="song-info">
            <div class="song-name">${song.split(`${folder}`)[1].replaceAll("%20"," ").split(".")[0]}</div>
            <div class="song-artist">Song Artist</div>
        </div>
        <div class="play-now">
            <p class="text">Play Now</p>
            <div class="icon"><i class="fa-solid fa-play"></i></div>
        </div>
    </li>`
    }
    return(songs)
}




const MusicChange=(path)=>{
    currentSong.src=path
    document.querySelector(".play-pause").src="images/pause.svg"
    document.querySelector(".music-name").innerHTML=`<p>${path.split(`${folder}`)[1].replaceAll("%20"," ").split(".")[0]}</p>`
    document.querySelector(".time-played").innerHTML=`00:00/00:00`
    currentSong.play()
    
}
const playMusic=(track)=>{
    console.log(track)
    currentSong.src=`${folder}`+track+".mp3"
    document.querySelector(".play-pause").src="images/pause.svg"
    document.querySelector(".music-name").innerHTML=`<p>${track}</p>`
    document.querySelector(".time-played").innerHTML=`00:00/00:00`
    currentSong.play()
}


async function main() {

    songs=await getSongs("songs/newFriday/")

    //Event listener for a card for playlist creation
    Array.from(document.getElementsByClassName("music-card")).forEach((e)=>{
        e.addEventListener("click", async (item)=>{
            console.log(item.currentTarget.dataset.folder)
            folder=`songs/${item.currentTarget.dataset.folder}/`
            let song=await getSongs(`songs/${item.currentTarget.dataset.folder}/`)
    })})

    //Attaching an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".song-info").firstElementChild.innerHTML.trim())
        })
    });


    //Attaching event listener to player buttons
    document.querySelector(".play-pause").addEventListener("click",(e)=>{
        if(currentSong.paused){
            currentSong.play()
            document.querySelector(".play-pause").src="images/pause.svg"
        }
        else{
            currentSong.pause()
            document.querySelector(".play-pause").src="images/play.svg"
        }
    })


    //Attaching listener for time update on seeker
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".time-played").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })

    //Attaching event listener for movement of seeker
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%"
        //e.offsetX returns the position where pointer is clicked. e.target.getBoundingClientRect() returns total lenght of the element. Via dividing the two, we are finding the reletive position percentage of pointer which we are then storing onto left margin of the circular pointer on the seeker.
        currentSong.currentTime=(e.offsetX/e.target.getBoundingClientRect().width)*currentSong.duration
    })

    //Add an event listener to next button
    document.querySelector(".next").addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src)
        if(index+1==songs.length){
            MusicChange(songs[0])
        }
        else{
            MusicChange(songs[index+1])
        }
    })

    //Add an event listener to previous button
    document.querySelector(".previous").addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src)
        if(index-1<0){
            MusicChange(songs[songs.length-1])
        }
        else{
            MusicChange(songs[index-1])
        }
    })

    //Volume setting event listener
    document.querySelector(".volume-seek").addEventListener("change",(e)=>{
        currentSong.volume=e.target.value/100
    })
}
main()
