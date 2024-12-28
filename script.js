const getStartedBtn = document.getElementById("get-started-btn");
const joinNowBtn = document.getElementById("join-now-btn");
const welcomeSection = document.getElementById("welcome-section");
const videoCallSection = document.getElementById("video-call-section");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let localStream;
let peerConnection;

const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // Google STUN server
  ],
};

// Handle "Get Started" Button
getStartedBtn.addEventListener("click", () => {
  welcomeSection.style.display = "none";
  videoCallSection.style.display = "block";
});

// Handle "Join Now" Button
joinNowBtn.addEventListener("click", async () => {
  try {
    // Access local media
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    // Set up PeerConnection
    peerConnection = new RTCPeerConnection(iceServers);

    // Add local stream tracks to the peer connection
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      remoteVideo.srcObject = stream;
    };

    // Create an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log("Offer created:", offer);

    // Placeholder: Simulate signaling (exchange offer/answer manually in dev tools)
    alert("Copy the following SDP to the remote peer:\n" + JSON.stringify(offer));

    // Listen for ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE Candidate:", event.candidate);
        // Send ICE candidate to remote peer via signaling server
      }
    };
  } catch (error) {
    console.error("Error accessing media devices:", error);
    alert("Unable to access your camera or microphone.");
  }
});

// Simulate receiving an answer (manually paste it here for testing)
async function handleRemoteAnswer(answer) {
  const remoteDesc = new RTCSessionDescription(answer);
  await peerConnection.setRemoteDescription(remoteDesc);
  console.log("Remote description set:", remoteDesc);
}
