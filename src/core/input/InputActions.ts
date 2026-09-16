import Phaser from 'phaser';

export type InputCleanup = () => void;

export interface RideControls {
  onTap: () => void;
  onLeft: () => void;
  onRight: () => void;
}

export class InputActions {
  bindPrimary(scene: Phaser.Scene, callback: () => void): InputCleanup {
    const pointerHandler = (): void => callback();
    const keyboardHandler = (): void => callback();

    scene.input.on('pointerdown', pointerHandler);
    scene.input.keyboard?.on('keydown-SPACE', keyboardHandler);

    let active = true;
    const cleanup = (): void => {
      if (!active) return;
      active = false;
      scene.input.off('pointerdown', pointerHandler);
      scene.input.keyboard?.off('keydown-SPACE', keyboardHandler);
      scene.events.off(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    };

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    return cleanup;
  }

  bindRideControls(scene: Phaser.Scene, controls: RideControls): InputCleanup {
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartedAt = 0;
    let tracking = false;

    const pointerDown = (pointer: Phaser.Input.Pointer): void => {
      pointerStartX = pointer.x;
      pointerStartY = pointer.y;
      pointerStartedAt = scene.time.now;
      tracking = true;
    };

    const pointerUp = (pointer: Phaser.Input.Pointer): void => {
      if (!tracking) return;
      tracking = false;

      const dx = pointer.x - pointerStartX;
      const dy = pointer.y - pointerStartY;
      const elapsed = scene.time.now - pointerStartedAt;
      const horizontalSwipe = Math.abs(dx) >= 42 && Math.abs(dx) > Math.abs(dy) * 1.15;

      if (horizontalSwipe) {
        if (dx < 0) controls.onLeft();
        else controls.onRight();
        return;
      }

      if (elapsed <= 420 && Math.hypot(dx, dy) < 28) controls.onTap();
    };

    const left = (): void => controls.onLeft();
    const right = (): void => controls.onRight();
    const tap = (): void => controls.onTap();

    scene.input.on('pointerdown', pointerDown);
    scene.input.on('pointerup', pointerUp);
    scene.input.keyboard?.on('keydown-LEFT', left);
    scene.input.keyboard?.on('keydown-A', left);
    scene.input.keyboard?.on('keydown-RIGHT', right);
    scene.input.keyboard?.on('keydown-D', right);
    scene.input.keyboard?.on('keydown-SPACE', tap);
    scene.input.keyboard?.on('keydown-UP', tap);

    let active = true;
    const cleanup = (): void => {
      if (!active) return;
      active = false;
      scene.input.off('pointerdown', pointerDown);
      scene.input.off('pointerup', pointerUp);
      scene.input.keyboard?.off('keydown-LEFT', left);
      scene.input.keyboard?.off('keydown-A', left);
      scene.input.keyboard?.off('keydown-RIGHT', right);
      scene.input.keyboard?.off('keydown-D', right);
      scene.input.keyboard?.off('keydown-SPACE', tap);
      scene.input.keyboard?.off('keydown-UP', tap);
      scene.events.off(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    };

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    return cleanup;
  }

  bindBack(scene: Phaser.Scene, callback: () => void): InputCleanup {
    const keyboardHandler = (): void => callback();
    scene.input.keyboard?.on('keydown-ESC', keyboardHandler);

    let active = true;
    const cleanup = (): void => {
      if (!active) return;
      active = false;
      scene.input.keyboard?.off('keydown-ESC', keyboardHandler);
      scene.events.off(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    };

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    return cleanup;
  }
}

export const inputActions = new InputActions();
