# Archivos vivos extraidos — 2026-10-01

## 1) Sketchfab (14 modelos, API publica v3)

Descarga de archivos BLOQUEADA sin token OAuth de Sketchfab (401 en
`/v3/models/{uid}/download`). Con token, solo 5 son descargables:

| UID | Modelo | Autor | Descargable | Licencia | Caras |
|-----|--------|-------|-------------|----------|-------|
| 62918957e1fd4667b679259c95822c5e | Cool Alien Spaceship by Jungle Jim | Jungle Jim | SI | CC Attribution | 26.629 |
| a1c688c6e8164fd4ad5a7e56047e8b50 | Alien Space Nebula 2 (Skybox) | Jungle Jim | SI | CC Attribution | 964 |
| 46c390591651438abe3ccb2396d16e6b | Free simple 3d galaxy (6000 stars) | caton.laubergiste | SI | CC Attribution | 252.042 |
| 74cbeaeae2174a218fe9455d77902b5c | Blackhole | rubykamen | SI | CC Attribution | 30.683 |
| db8f1c8cba3b464993e216acbf4a69b9 | Of Planes and Satellites | Loic Norgeot | SI | CC Attribution | 219.509 |
| 1bbccc7c05e845fd8865d92c25d85f3d | The aftermath of a nova explosion | Salvatore Orlando | NO | Standard | 1.101.605 |
| d76b5b77f070464bb47dd84b8c3a2e13 | Supernova shock breakout | Salvatore Orlando | NO | (ninguna) | 427.352 |
| 2a750aef938642a7b1135e9b4613da37 | The Helix nebula, last breath of a star | Salvatore Orlando | NO | (ninguna) | 825.135 |
| 9e62063330924364a941a6ca11db7996 | An active Seyfert Galaxy | Salvatore Orlando | NO | Standard | 1.286.830 |
| bc068b682f4243b2b702202a65df804d | Bright stars of an open cluster | Salvatore Orlando | NO | Standard | 146.639 |
| f3d06d6bb3794377afa7735460f23414 | A highly magnetized rotating neutron star | Salvatore Orlando | NO | Editorial | 212.306 |
| c876c7449be643f196beed027b1b14b4 | Pulsar, a magnetized rotating neutron star | Salvatore Orlando | NO | (ninguna) | 380.194 |
| 4d1727c7b83e4e628bbadb63dbb537e | The Creation of Adam | — | 404 | UID incompleto en la URL pegada | — |
| d6521362b37b48e3a82bce491140930 | Need some space | — | 404 | UID incompleto en la URL pegada | — |

## 2) belentani.base44.app (SPA, bundle /assets/index-DKt6QH-Q.js — 1.086.462 B)

Sin ningun archivo 3D. Solo imagenes remotas:

| Archivo local | Origen | KB |
|---|---|---|
| belentani_logo.png | media.base44.com 770988d0c_logo.png | 446,5 |
| b44_39922a65c.png | media.base44.com 39922a65c_file_...png | 882,3 |
| b44_upscalemedia3.jpg | media.base44.com 6ecbcc953_upscalemedia-transformed3.jpg | 48 |
| catbox_8s1v5g.jpg | files.catbox.moe | 1.931,9 |
| catbox_h0wamv.jpg | files.catbox.moe | 5.518,9 |
| catbox_rt1p03.jpg | files.catbox.moe | 1.193,2 |
| catbox_kmtlco.jpg | files.catbox.moe | 3.333,2 |
| catbox_tf46wf.jpg | files.catbox.moe | 465,7 |
| catbox_943t1r.png | files.catbox.moe | 9.953,5 |

## 3) judas-experience-13898.buildaispace.app (Next.js, "Belentani | BuildAI.space")

Codigo real en `/api/runtime/bundle?appId=fQbep3r84mkuYrSWXmBZ` (263.585 B).
Sin .glb/.gltf/.hdr: tampoco hay 3D, solo imagenes + texturas externas.

| Archivo local | Origen | KB |
|---|---|---|
| judas_logo_v2.png | propio del sitio | 146 |
| judas_manifest.json | propio del sitio | - |
| g_logo.png (= g_BnUqoEfIfg.png, mismo hash) | space-apps-assets RVRv3UI7vh-...png | 1.097,6 |
| g_01-copia.jpeg | 0NWrLFCV0Y-... | 253,3 |
| g_01-01-copia.jpeg | oYYQfv8VPR-... | 216,6 |
| g_0E6TSr6Rio.png | 0E6TSr6Rio-... | 1.218,4 |
| g_BnUqoEfIfg.png | BnUqoEfIfg-...png | 1.097,6 |
| g_FfEYvFQhiL.png | FfEYvFQhiL-...png | 632,6 |
| g_JfHXANZs7w.png | JfHXANZs7w-...png | 344,4 |
| g_svZuqY9Hcn_upscaled.png | svZuqY9Hcn-...png | 664,9 |
| g_K0Eizdcy0n.png | K0Eizdcy0n-...png | 2.963 |
| g_Lrpnf9kRVA.jpeg | Lrpnf9kRVA-... | 210 |
| g_aiease_01.jpeg | aiease_... | 403 PROHIBIDO (no baja) |
| tt_cubes.png / tt_black-scales.png / tt_carbon-fibre.png | transparenttextures.com | pequenos |
| (huerfano) scanlines.png | ruta pedida por el codigo | 404 (devuelve HTML del SPA) |
| (huerfano) aiease_1777100184773-01.jpeg | storage | 403 |

## Conclusion

- Los 15 enlaces de Sketchfab NO son assets vivos de ninguno de los dos sitios:
  ninguno de los dos webs los embebe. Son referencias externas.
- Para bajar los 5 modelos CC hace falta un token OAuth2 de Sketchfab
  (https://sketchfab.com/settings/password -> Developer -> Access Token).
  Los 9 restantes de Salvatore Orlando no son descargables por licencia.
