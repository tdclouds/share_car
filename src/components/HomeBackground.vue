<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Camera, Color, Geometry, Mesh, Program, Renderer } from 'ogl';
import { fragment, vertex } from '@/assets/glsl.ts';

const containerRef = ref<HTMLDivElement>();
let animationId = 1;
const renderer = new Renderer({ depth: false, alpha: true });
const gl = renderer.gl;

const camera = new Camera(gl, { fov: 15 });
camera.position.z = 15;

function resize(): void {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  animationId = requestAnimationFrame(update);
}

const num = 100;
const position = new Float32Array(num * 3);
const random = new Float32Array(num * 4);

for (let i = 0; i < num; i++) {
  position.set([Math.random(), Math.random(), Math.random()], i * 3);
  random.set(
    [Math.random(), Math.random(), Math.random(), Math.random()],
    i * 4,
  );
}

const geometry = new Geometry(gl, {
  position: { size: 3, data: position },
  random: { size: 4, data: random },
});

const program = new Program(gl, {
  vertex,
  fragment,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new Color('#0072FF') },
  },
  transparent: true,
  depthTest: false,
});

const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

function update(t: number): void {
  // animationId = requestAnimationFrame(update);

  // add some slight overall movement to be more interesting
  particles.rotation.x = Math.sin(t * 0.0002) * 0.1;
  particles.rotation.y = Math.cos(t * 0.0005) * 0.15;
  particles.rotation.z += 0.001;

  program.uniforms.uTime.value = t * 0.0001;
  renderer.render({ scene: particles, camera });
}

onMounted(() => {
  try {
    containerRef.value?.appendChild(gl.canvas);
    gl.clearColor(1, 1, 1, 0);
    window.addEventListener('resize', resize, false);
    resize();
    animationId = requestAnimationFrame(update);
  } catch (error) {
    console.error(error);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize, false);
  cancelAnimationFrame(animationId);
});
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 dark:bg-black -z-10 pointer-events-none"
  ></div>
</template>

<style scoped></style>
