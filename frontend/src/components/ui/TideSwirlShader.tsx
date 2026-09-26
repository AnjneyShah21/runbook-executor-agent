'use client';

import { useEffect, useRef } from 'react';

export function TideSwirlShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        float time = u_time * 0.25;

        vec2 p = st * 3.2;
        for (int i = 1; i < 5; i++) {
          float fi = float(i);
          p.x += 0.35 / fi * sin(fi * 2.8 * p.y + time * 0.8 + fi);
          p.y += 0.35 / fi * cos(fi * 2.8 * p.x + time * 0.8 + fi);
        }

        float v = sin(p.x + p.y);

        // Tide Swirl GPU Color Palette (Deep Navy -> Tide Cyan -> Electric Indigo -> Glow Teal)
        vec3 c1 = vec3(0.03, 0.05, 0.12);
        vec3 c2 = vec3(0.05, 0.22, 0.42);
        vec3 c3 = vec3(0.22, 0.18, 0.58);
        vec3 c4 = vec3(0.02, 0.52, 0.72);

        vec3 col = mix(c1, c2, smoothstep(-1.0, 0.3, v));
        col = mix(col, c3, smoothstep(-0.2, 0.7, sin(v * 2.0 + time)));
        col = mix(col, c4, pow(max(0.0, sin(p.x * 2.0)), 4.0) * 0.45);

        gl_FragColor = vec4(col, 0.70);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    let animationFrameId: number;
    const startTime = performance.now();

    function resize() {
      if (!canvas || !gl) return;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    }

    function render() {
      resize();
      if (!gl || !canvas) return;
      const currentTime = (performance.now() - startTime) / 1000;
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, currentTime);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-75 transition-opacity duration-1000"
    />
  );
}
