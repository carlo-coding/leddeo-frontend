export function getVideoDuration(video: File): Promise<number> {
  const videoElement = document.createElement("video");
  videoElement.src = URL.createObjectURL(video);

  return new Promise((resolve, reject) => {
    videoElement.onloadedmetadata = () => {
      resolve(videoElement.duration);
    };
    videoElement.onerror = () => {
      reject("Error loading video");
    };
  });
}
