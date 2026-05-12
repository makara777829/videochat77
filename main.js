const APP_ID = 0faabb32a9964b9a83e5e6b0ed3a0bb9; 
const TOKEN = null;
const CHANNEL = "main_room";

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});
let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null);
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    localTracks[1].play('user-1');
    await client.publish([localTracks[0], localTracks[1]]);
};

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user;
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
        user.videoTrack.play('user-2');
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
};

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
};

document.getElementById('join-btn').addEventListener('click', joinAndDisplayLocalStream);
document.getElementById('leave-btn').addEventListener('click', async () => {
    for(let track of localTracks){
        track.stop();
        track.close();
    }
    await client.leave();
    window.location.reload();
});
