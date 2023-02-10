import audioEnconder from "audio-encoder";

export function getAudioFromVideo(video: File): Promise<File> {
  const sampleRate = 16000;
  const numberOfChannels = 1;

  let audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  let reader = new FileReader();
  let myBuffer: AudioBuffer;

  reader.readAsArrayBuffer(video);

  return new Promise((resolve, reject) => {
    reader.onload = async function () {
      try {
        let videoFileAsBuffer = reader.result;
        if (videoFileAsBuffer === null || typeof videoFileAsBuffer === "string")
          throw new Error("Unable to process video data");
        let decodedAudioData = await audioContext.decodeAudioData(
          videoFileAsBuffer
        );
        let duration = decodedAudioData.duration;
        let offlineAudioContext = new OfflineAudioContext(
          numberOfChannels,
          sampleRate * duration,
          sampleRate
        );
        let soundSource = offlineAudioContext.createBufferSource();
        myBuffer = decodedAudioData;
        soundSource.buffer = myBuffer;
        soundSource.connect(offlineAudioContext.destination);
        soundSource.start();
        let renderedBuffer = await offlineAudioContext.startRendering();
        audioEnconder(
          renderedBuffer,
          128,
          function (data: any) {
            console.log(data);
          },
          function (blob: BlobPart) {
            const file = new File([blob], "audio.mp3", {
              type: "audio/mp3",
            });
            resolve(file);
          }
        );
      } catch (err) {
        reject(err);
      }
    };
  });
}
