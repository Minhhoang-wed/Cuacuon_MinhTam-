"use client";

import { CI360Viewer } from "@cloudimage/360-view/react";

export function ProductSpinViewer({ images }: { images: string[] }) {
  return (
    <CI360Viewer
      className="product-spin-cylindrical"
      imageListX={images}
      amountX={images.length}
      draggable
      swipeable
      keys
      autoplay
      autoplayBehavior="spin-x"
      playOnce
      speed={85}
      dragSpeed={180}
      inertia
      zoomControls
      zoomMax={2.5}
      zoomControlsPosition="bottom-right"
      hints={["drag", "pinch"]}
      initialIconShown
      brandColor="#0b2a3c"
      aspectRatio="4/3"
    />
  );
}
