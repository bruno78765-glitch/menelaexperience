import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const cacheModelos = new Map<string, THREE.Group>();
const loader = new GLTFLoader();

/**
 * Carregador glTF preparado para substituir geometrias procedurais por kits CC0
 * (Kenney, Quaternius) mantendo fallback automático para o gerador procedural.
 */
export async function carregarModeloGltfOuFallback(
  urlModelo: string,
  criarFallback: () => THREE.Object3D
): Promise<THREE.Object3D> {
  const emCache = cacheModelos.get(urlModelo);
  if (emCache) {
    return emCache.clone(true);
  }

  try {
    const gltf = await loader.loadAsync(urlModelo);
    cacheModelos.set(urlModelo, gltf.scene);
    return gltf.scene.clone(true);
  } catch {
    return criarFallback();
  }
}
