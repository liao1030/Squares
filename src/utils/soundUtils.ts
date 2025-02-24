// 使用 Web Audio API 創建音效
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

const createOscillator = (frequency: number, duration: number) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  return { oscillator, gainNode };
};

export const playPlaceSound = () => {
  const { oscillator, gainNode } = createOscillator(440, 0.1); // A4 音
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const playRotateSound = () => {
  const { oscillator, gainNode } = createOscillator(523.25, 0.05); // C5 音
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
};

export const playGameOverSound = () => {
  const { oscillator, gainNode } = createOscillator(293.66, 0.3); // D4 音
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}; 