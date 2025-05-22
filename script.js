
let currentSong = new Audio();

function formatSeconds(seconds) {
    const totalSeconds = Math.floor(seconds); // Or use Math.round() if preferred
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
// console.log(formatSeconds(12));     // "00:12"
// console.log(formatSeconds(75));     // "01:15"
// console.log(formatSeconds(600));    // "10:00"


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/content/songs/")
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const ele = as[index];
        if (ele.href.endsWith(".mp3")) {
            songs.push(ele.href.split("/songs/")[1].replaceAll("%20", " "));
        }
    }
    return songs;
}

function playMusic(track, pause=false) {
    // let audio = new Audio(encodeURI(`/content/songs/${track}`));
    
    currentSong.src = encodeURI(`/content/songs/${track}`);
    if(!pause){
        currentSong.play();
    }
    currentSong.play().then(() => {
        document.querySelector(".mid").style.gap = "0px";
        play.src = "/content/svgs/pause.svg";
    }).catch((error) => {
        console.error("Error playing audio:", error);
    });
    document.querySelector(".songInfo").innerHTML = track;
    // document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

async function main() {
    document.querySelector(".mid").style.gap = "18px";
    let songs = await getSongs();
    // console.log(songs);
    playMusic(songs[0], true);


    // var audio = new Audio(songs[0]);
    // audio.play();

    let songUl = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `
        <li class="flex align-center">
                                <img src="/content/svgs/music.svg" class="invert" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Harry</div>
                                </div>
                                <div class="playNow">
                                
                                    <img class="invert" src="/content/svgs/play.svg" alt="">
                                </div>
                            
         
        </li>`;
    }

    // audio.addEventListener("loadeddata", ()=>{
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // });



    // Wait for user interaction to play the audio
    // const play = document.createElement("button");
    const play = document.querySelector("#play");
    // play.textContent = "Play Song";
    // play.style.padding = "10px";
    // play.style.height = "50px";
    // play.style.margin = "20px";
    // play.style.cursor = "pointer";
    // document.body.appendChild(play);


    // play.addEventListener("click", () => {
    //     if (!currentSong.src) {
    //         console.error("No audio source set for currentSong");
    //         return;
    //     }

    //     if (currentSong.paused) {
    //         currentSong.play().then(() => {
    //             play.src = "/content/svgs/pause.svg";
    //             console.log("Audio is playing");
    //         }).catch((error) => {
    //             console.error("Error playing audio:", error);
    //         });
    //     } else {
    //         currentSong.pause();
    //         play.src = "/content/svgs/play.svg";
    //         console.log("Audio is paused");
    //     }
    // });

    // play.addEventListener("click", () => {
    //     currentSong.paused().then(() => {
    //         console.log("Playing");
    //         // console.log("Audio is playing");
    //     }).catch((error) => {
    //         console.error("Error playing audio:", error);
    //     });

    // });
    // audio.addEventListener("loadeddata", () => {
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // });



    // Attach an event listener to each song to play the audio when clicked
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });

    // Attach an event listener to play, next, previous
    play.addEventListener("click", ()=>{
        if (!currentSong.src) {
            console.error("No audio source set for currentSong");
            return;
        }
        if (currentSong.paused){
            // currentSong.play();
            // play.src = "/content/svgs/pause.svg";
            currentSong.play().then(() => {
                document.querySelector(".mid").style.gap = "0px";
                play.src = "/content/svgs/pause.svg";
                console.log("Audio is playing");
            }).catch((error) => {
                console.error("Error playing audio:", error);
            });
        }
        else{
            currentSong.pause();
            play.src = "/content/svgs/play.svg";
            console.log("Audio is Paused");
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".timeStart").innerHTML = `${formatSeconds(currentSong.currentTime)}`; 
        document.querySelector(".timeEnd").innerHTML = `${formatSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";

    })

    // Add event listner for seekbar
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100; 
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent)/100;
    })

    // Add event for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
        document.querySelector(".hamburger").style.width = "0";
        document.querySelector(".cross").style.width = "34px";
        document.querySelector(".cross").style.position = "relative";
        document.querySelector(".cross").style.left = "-45px";
    })
    
    document.querySelector(".cross").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%";
        document.querySelector(".hamburger").style.width = "34px";
        document.querySelector(".cross").style.width = "0";

    })


}

main();
