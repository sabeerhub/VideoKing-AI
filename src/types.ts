/**
 * Shared Type Definitions for VideoKing-AI
 */

export type GenerationMode = "video" | "image";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: string;
  lastLogin: string;
  accountStatus: "Free Tier" | "Creator Pro" | "VideoKing Developer";
}

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  data: string; // Base64 encoded file contents or url data
}

// Subcomponents of a Video Storyboard Scene
export interface VideoScene {
  sceneNumber: number;
  duration: number; // in seconds
  visualSpecification: string; // image prompt for this scene
  narration: string; // voiceover text
  cameraMovement: string; // direction
  captionOverlay: string; // text caption overlay in the video
}

// Full video storyboard output
export interface VideoGenerationData {
  title: string;
  targetAudience: string;
  viralScore: number;
  videoLengthSec: number;
  strategyDescription: string;
  soundDesignPrompt: string;
  hooks: string[];
  tags: string[];
  scenes: VideoScene[];
}

// Expanded detailed image generation output
export interface ImageGenerationData {
  originalPrompt: string;
  expandedPrompt: string;
  aestheticStyle: string;
  lightingSpec: string;
  colorPalette: string[];
  cinematographyNotes: string[];
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  timestamp: string;
  text: string;
  mode?: GenerationMode;
  attachedFile?: {
    name: string;
    type: string;
    size: number;
  };
  videoResult?: VideoGenerationData;
  imageResult?: ImageGenerationData;
  imageBase64?: string; // If a real base64 image is returned
  warning?: string;
}

export interface GenerationSettings {
  aspectRatio: "16:9" | "9:16" | "1:1";
  videoResolution: "720p" | "1080p";
  narratorVoice: "Zephyr" | "Kore" | "Puck" | "Charon";
}
