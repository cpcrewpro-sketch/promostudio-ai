export interface Scene {
  visualDescription: string;
  narration: string;
  duration: number;
}

export interface AdData {
  title: string;
  slogan: string;
  targetAudience: string;
  scenes: Scene[];
  keyFeatures: string[];
  heroImageUrl?: string;
  vibe: string;
}
