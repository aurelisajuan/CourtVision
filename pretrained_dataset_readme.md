# 4 K4D Web Viewer – End-to-End Setup Guide

> **Goal:** Render any 4 K4D scene on a GPU box and stream it to a browser
> (or `<iframe>`).
> **Test scene:** `sport2` (NHR dataset).
> **Outcome:** Local network viewer with orbit, zoom, play/pause, timeline.

---

## 0 · System prerequisites

| Component  | Notes                                              |
| ---------- | -------------------------------------------------- |
| **GPU**    | NVIDIA RTX-20xx/30xx/40xx or similar (≥ 8 GB)      |
| **OS**     | Linux, WSL 2, or Windows with CUDA 11.8+           |
| **Python** | 3.9 – 3.11 (Conda recommended)                     |
| **Ports**  | TCP **1024** open inbound/outbound                 |
| **Node**   | (only for building React viewer) Node 18+ / npm 9+ |

---

## 1 · Clone & install 4 K4D

```bash
git clone https://github.com/zju3dv/4K4D.git
cd 4K4D
conda env create -f environment.yml   # creates “easyvolcap” env
pip install -e . --no-deps --no-build-isolation   # puts THIS easyvolcap on PYTHONPATH
```

> *Why?*
> `pip install -e .` ensures **this** copy of EasyVolcap (the fork inside
> 4 K4D) is the one Python imports, avoiding version drift with any other
> EasyVolcap you may have.

---

## 2 · Pin `websockets` 10.4

The upstream server thread expects the ≤ 10.x API.

```bash
pip install -U "websockets==10.4"
```

> *Why?*
> Starting with websockets 11 the “implicit event loop” vanished, causing
> `RuntimeError: no running event loop`. Version 10.4 works as-is.

*(If you prefer the latest websockets, patch
`easyvolcap/runners/websocket_server.py` to create its own loop—see
appendix.)*

---

## 3 · Download assets (minimal dataset + pretrained model)

```bash
# Assuming you already have Google-Drive links:
# put them exactly under these paths:
data/
 └─ trained_model/4k4d_sport2/1599.npz
 └─ NHR/sport2/
     ├─ videos_libx265/…          (from .tar.gz)
     └─ optimized/…               (from .tar.gz)
```

#### Extract images & masks once

```bash
python scripts/realtime4dv/extract_images.py --data_root data/NHR/sport2
python scripts/realtime4dv/extract_masks.py  --data_root data/NHR/sport2
```

> *Why?*
> Minimal dataset stores each camera stream as a small H.265 video.
> These two scripts decode PNG/JPEG frames the renderer expects.

---

## 4 · Launch headless renderer + WebSocket server

```bash
QT_QPA_PLATFORM=offscreen \              # no GUI/GL window
evc-gui \
  -c "configs/projects/realtime4dv/rendering/4k4d_sport2.yaml,\
      configs/specs/video.yaml,\
      configs/specs/server.yaml" \
  model_cfg.sampler_cfg.render_gs=True \
  viewer_cfg.headless=True \
  -v
```

* Console prints
  `Listening on 0.0.0.0:1024`
  FPS lines confirm rendering is live.

> *Why these flags?*
>
> * **`video.yaml`** – tells 4 K4D to read pre-extracted images/masks.
> * **`server.yaml`** – starts WebSocket endpoint.
> * **`render_gs=True`** – uses CUDA tile rasterizer (no CUDA-GL interop
>   needed, keeps > 60 fps on WSL).
> * **`headless=True`** – suppresses Qt window; perfect for servers.

---

## 5 · Quick native viewer check (optional)

```bash
evc-ws --host 127.0.0.1 --port 1024 -- \
       -c configs/datasets/NHR/NHR.yaml
```

If a PySide window appears and responds to orbit/zoom, the server is good.

---

## 6 · Build the React web player

### 6.1  Create a tiny React app

```bash
npx create-vite@latest 4k4d-viewer --template react-ts
cd 4k4d-viewer
npm install
```

Copy the two files from this guide:

```
src/4K4DPlayer.tsx
src/player.css
```

Replace `src/App.tsx` with:

```tsx
import K4DPlayer from "./4K4DPlayer";

export default function App() {
  const ws = new URLSearchParams(window.location.search).get("ws") ??
             "ws://127.0.0.1:1024";
  return (
    <div style={{width:"100vw",height:"100vh"}}>
      <K4DPlayer wsUrl={ws}/>
    </div>
  );
}
```

Build:

```bash
npm run build          # output → dist/
```

### 6.2  Serve the static files

Simplest local test:

```bash
npx serve dist -l 5174   # http://localhost:5174
```

Visit:

```
http://localhost:5174/?ws=ws://127.0.0.1:1024
```

You’ll see:

* Canvas stream
* ⏯ play/pause button
* scrub slider showing *frame/total*
* Orbit (L-drag) & zoom (wheel) work.

---

## 7 · Embed in any site

```html
<iframe
  src="https://cdn.example.com/4k4d-viewer/index.html?ws=ws://192.168.1.42:1024"
  style="width:100%;height:100%;border:0;" allowfullscreen>
</iframe>
```

---

# Command Reference & Rationale

| Step                        | Command                                              | Purpose                                                                 |
| --------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| **Install repo**            | `pip install -e . --no-deps --no-build-isolation`    | Ensures Python imports the 4 K4D-embedded EasyVolcap, not another copy. |
| **Pin websockets**          | `pip install "websockets==10.4"`                     | Keeps server thread compatible with implicit loop API.                  |
| **Extract minimal dataset** | `extract_images.py / extract_masks.py`               | Decode H.265 → per-frame PNG/JPEG.                                      |
| **Run renderer**            | `evc-gui -c "...sport2.yaml,video.yaml,server.yaml"` | Loads scene, enables WebSocket endpoint.                                |
|                             | `model_cfg.sampler_cfg.render_gs=True`               | Switches to CUDA tile rasterizer (fast, no CUDA-GL).                    |
|                             | `viewer_cfg.headless=True`                           | No Qt window; safe for SSH/WSL/servers.                                 |
| **Client test**             | `evc-ws --host 127.0.0.1 --port 1024 -- -c NHR.yaml` | Native PySide viewer; good sanity check.                                |
| **React build**             | `npm run build`                                      | Produces `dist/` with `K4DPlayer` for web deployment.                   |
| **Serve static**            | `serve dist -l 5174`                                 | Quick local HTTP server.                                                |
| **Iframe embed**            | `<iframe src="…?ws=ws://server:1024">`               | Loads viewer anywhere, passes WebSocket URL via query.                  |

---

## Appendix · Using websockets ≥ 11

If you prefer not to pin the library, patch one file:

```python
# easyvolcap/runners/websocket_server.py
def start_server(self):
    import asyncio, websockets
    loop = asyncio.new_event_loop()   # ★ added
    asyncio.set_event_loop(loop)      # ★ added
    server = websockets.serve(self.server_loop, self.host, self.port)
    loop.run_until_complete(server)
    loop.run_forever()
```

Re-launch `evc-gui`; you’ll now see `Listening on 0.0.0.0:1024`.
