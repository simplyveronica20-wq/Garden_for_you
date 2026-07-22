import { useEffect, useState } from 'react';
import { GardenGate } from './garden/GardenGate';
import { Garden } from './garden/Garden';
import { Loading } from './garden/Loading';
import { FairyDust } from './garden/Ambient';
import { useGardenState } from './garden/useGardenState';
import { useAudio } from './garden/audio';

type Scene = 'loading' | 'gate' | 'garden';

export default function App() {
  const [scene, setScene] = useState<Scene>('loading');
  const garden = useGardenState();
  const audio = useAudio();

  // Brief loading for theme immersion.
  useEffect(() => {
    const t = setTimeout(() => setScene('gate'), 1600);
    return () => clearTimeout(t);
  }, []);

  const enterGarden = () => {
    audio.unlock();
    audio.play('gate');
    setScene('garden');
  };

  if (scene === 'loading') {
    return (
      <>
        <Loading />
        <FairyDust count={12} />
      </>
    );
  }

  if (scene === 'gate') {
    return (
      <>
        <GardenGate onEnter={enterGarden} />
        <FairyDust count={16} />
      </>
    );
  }

  return (
    <>
      <Garden state={garden} audio={audio} />
      <FairyDust count={20} />
    </>
  );
}
