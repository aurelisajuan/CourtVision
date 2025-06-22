# EasyVolcap Custom Dataset Training Guide

---

## 1 · Purpose

These notes turn the one‑off shell session into a repeatable, **why‑focused** playbook for training a new volumetric video sequence with EasyVolcap.
They assume an Ubuntu 22.04 box with an RTX‑class GPU (CUDA 12.2+) and conda installed.

---

## 2 · Directory Conventions

```
project_root/
├── videos/            # raw multi‑view MP4s (00/, 01/, …)
├── data/              # generated dataset assets
│   └── my_project/
│       ├── images/    # all extracted JPG frames
│       ├── intri.yml  # COLMAP output – camera intrinsics
│       └── extri.yml  # COLMAP output – camera extrinsics
├── configs/           # exp & dataset YAMLs
└── scripts/           # helper bash/python
```

*Why?* EasyVolcap hard‑codes several relative paths (e.g., `images/`, `intri.yml`). Matching its expectations avoids custom code.

---

## 3 · Environment Setup

### 3.1 Create an isolated conda env

```bash
conda create -y -n easyvolcap python=3.10
conda activate easyvolcap
```

*Why 3.10?* EasyVolcap (and tiny‑cuda‑nn) are tested up to 3.10; newer versions raise ABI warnings.

### 3.2 Install CUDA‑enabled PyTorch first

```bash
pip install torch torchvision torchaudio \
  --index-url https://download.pytorch.org/whl/cu128  # CUDA 12.8 wheel
```

*Why first?* Some later `pip` installs compile against the active `torch` headers—having the correct CUDA wheel pre‑installed prevents mismatched binaries.

### 3.3 Clone source & system libs

```bash
git clone https://github.com/zju3dv/EasyVolcap.git
cd EasyVolcap
sudo apt update && sudo apt install -y \
  libxrandr-dev libxinerama-dev libxcursor-dev libxi-dev \
  libgl1-mesa-dev libglu1-mesa-dev libx11-dev
```

*Why the X11/OpenGL dev libs?* The WebGL preview & ImGui viewer need them even in headless mode for off‑screen GL contexts.

### 3.4 Python deps

```bash
pip install -v -e .   # pulls requirements.txt & installs as editable package
```

---

## 4 · Method‑Specific Native Extensions

| Library                           | Purpose                                                           | Key build flags                                                             |
| --------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **tiny‑cuda‑nn**                  | Instant‑NGP hash‑grid encoder used by several EasyVolcap networks | `cmake . -B build && cmake --build build` then `pip install bindings/torch` |
| **diff‑gaussian‑rasterization**   | 3D Gaussian Splatting renderer                                    | `pip install -e .`                                                          |
| **pytorch3d, open3d, simple‑knn** | Mesh fusion & point‑cloud ops                                     | Installed from GitHub wheels                                                |

*Why compile from source?* Upstream wheels often lag behind CUDA 12 and fail to import (GLIBCXX 3.4.30 errors). Building ensures ABI parity.

---

## 5 · Preparing Raw Data

### 5.1 Populate `videos/`

Place each camera’s MP4 in a numbered sub‑dir (`00/`, `01/`, …) and name the file `video.mp4` for the helper script to pick up.

### 5.2 Extract frames @ 5 FPS

```bash
DATA_ROOT="data/my_project"
VIDEO_NAME="video.mp4"

mkdir -p "${DATA_ROOT}/images"
for d in ${DATA_ROOT}/videos/*/; do
  cam=$(basename "$d")
  ffmpeg -i "$d$VIDEO_NAME" -vf "fps=5" -q:v 2 -start_number 0 \
         "${DATA_ROOT}/images/${cam}/%06d.jpg"
done
```

*Why 5 FPS?* Balances temporal fidelity with manageable GPU memory when sequences exceed thousands of frames.

---

## 6 · Single‑Image Proxy for COLMAP

COLMAP only needs **one** frame per camera for pose initialization; feeding the full clip wastes hours.

```bash
COLMAP_IMAGE_DIR="${DATA_ROOT}/colmap_images"
mkdir -p "$COLMAP_IMAGE_DIR"
for d in ${DATA_ROOT}/images/*/; do
  cp "${d}000000.jpg" "$COLMAP_IMAGE_DIR/view_$(basename $d).jpg"
done
```

---

## 7 · Running COLMAP

1. **Temporarily** move `colmap_images` into `images/00`—EasyVolcap’s wrapper expects a single folder.
2. Execute the helper:

   ```bash
   python scripts/colmap/run_colmap.py --data_root "$DATA_ROOT"
   ```
3. Convert the sparse model to YAML:

   ```bash
   python scripts/colmap/colmap_to_easyvolcap.py \
     --data_root "$DATA_ROOT" \
     --colmap colmap/colmap_sparse/0
   ```
4. Restore the full frame set (`images_full_dataset`).

*Why this dance?* The wrapper is hard‑wired for the ZJU‑mocap layout. By faking a monocular scene during SfM we avoid patching the script.

---

## 8 · Training – L3MHet Pipeline

```bash
evc-train -c configs/exps/l3mhet/l3mhet_my_project.yaml
```

Key config highlights:

```yaml
# l3mhet_my_project.yaml (excerpt)
configs:
  - configs/base.yaml
  - configs/models/l3mhet.yaml
  - configs/datasets/my_project/my_project.yaml
  - configs/specs/blurry.yaml    # ↳ enable motion blur handling
  - configs/specs/optcam.yaml    # ↳ optimize extrinsics during training
  - configs/specs/transient.yaml # ↳ handle dynamic content
model_cfg:
  network_cfg.parameterizer_cfg.radius: 10.0 # large scenes → avoid early over‑contraction
  xyzt_embedder_cfg.xyz_embedder_cfg.bounds: [[-20,-20,-20],[20,20,20]]
```

*Why L3MHet?* Handles both large‑scale static backgrounds and small dynamic actors in one feed‑forward network.

---

## 9 · Validation & Visualization

```bash
# quick orbit render
evc-test -c configs/exps/l3mhet/l3mhet_${expname}.yaml,configs/specs/spiral.yaml \
          runner_cfg.visualizer_cfg.save_tag=${expname}

# fuse per‑frame Gaussians into a watertight mesh
python scripts/fusion/volume_fusion.py -- -c configs/exps/l3mhet/l3mhet_${expname}.yaml \
  val_dataloader_cfg.dataset_cfg.ratio=0.25 \
  val_dataloader_cfg.dataset_cfg.view_sample=0,null,25
```

Rename fused `frameXXXXXX.ply` ➜ `000000.ply` (loop below) so downstream viewers sort naturally.

---

## 10 · 3D Gaussian Splatting Variant

If the scene is mostly dynamic foreground without heavy occluders, `gaussiant.yaml` trains **much faster** (\~15 min) at slightly lower crispness.

```bash
evc-train -c configs/exps/gaussiant/gaussiant_my_project.yaml
```

Remember to `pip install --upgrade git+https://github.com/dendenxu/diff-gaussian-rasterization.git` after CUDA upgrades.

---

## 11 · Toggles & Gotchas

| Issue                                 | Fix / Rationale                                                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `GLIBCXX_3.4.30` import error         | `conda install -c conda-forge libstdcxx-ng libgcc-ng` ensures newer libstdc++ than Ubuntu‑repo one                                        |
| Viewer crashes with mis‑named cameras | Camera folder names **must** match those encoded in `intri.yml` & `extri.yml`; keep the `00/`, `01/`… pattern                             |
| Shaky orbit render                    | Set `val_dataloader_cfg.dataset_cfg.use_aligned_cameras: False` *before* extracting optimized cameras, then revert to `True` for training |

---

## 12 · Appendix – Full Command Chronology

<details>
<summary>Click to expand</summary>

```bash
# 1. create folders
mkdir -p videos data configs/datasets/myseq scripts

# 2. conda env + torch (CUDA12)
conda create -y -n easyvolcap python=3.10 && conda activate easyvolcap
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128

# 3. clone + build extensions
...
```

*(continues – identical to Section 3‑10 above)*

</details>
