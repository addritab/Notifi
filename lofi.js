const playlist = [
    { src: "goodnight.mp3", title: "Goodnight" },
    { src: "playadelsol.mp3", title: "Playa del Sol" },
    { src: "whisperingvinyl.mp3", title: "Whispering Vinyl" }
];

let currentTrack = 0;
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const songTitle = document.getElementById('songTitle');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const backBtn = document.getElementById('backbtn');
const nextBtn = document.getElementById('nextbtn');
const volumeBar = document.getElementById('volumeBar');

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    songTitle.textContent = track.title;
    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    audio.load();
}

function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

function playPause() {
    if (audio.paused) {
        audio.play();
        playPauseBtn.src = "pause.png";
        playPauseBtn.alt = "Pause";
    } else {
        audio.pause();
        playPauseBtn.src = "play.png";
        playPauseBtn.alt = "Play";
    }
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.src = "pause.png";
    playPauseBtn.alt = "Pause";
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.src = "pause.png";
    playPauseBtn.alt = "Pause";
}

playPauseBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', nextTrack);
backBtn.addEventListener('click', prevTrack);

audio.addEventListener('loadedmetadata', () => {
    progressBar.max = Math.floor(audio.duration);
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

audio.addEventListener('ended', nextTrack);

volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value;
});

window.addEventListener('DOMContentLoaded', () => {
    loadTrack(currentTrack);
    audio.volume = volumeBar.value;
    playPauseBtn.src = "play.png";
    playPauseBtn.alt = "Play";
});
