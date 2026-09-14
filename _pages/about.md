---
permalink: /
title: "About me"
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---
I'm a PhD candidate in Computer Engineering at Northwestern University. My researches focus in fault-tolerance hardware design, reconfigurable architectures, on-device learning, and hardware-algorithm co-design.

I focus on building resource-efficient and fault-resilient neural network accelerators and compilation frameworks. My work spans automated ML compilation toolchains, fixed-point on-device backpropagation, post-silicon ASIC bring-up, and hardware reliability for edge computing platforms.


## Publications

### Conferences
* **Toward Reconfigurable In-Pixel Computing: A Fault-Tolerant Design Flow for Machine Learning Accelerators**  
  **Houxuan Guo**, M. B. Valentín, X. He, and S. Ogrenci  
  *2025 IEEE 33rd Annual International Symposium on Field-Programmable Custom Computing Machines (FCCM)*, 2025 | [IEEE Xplore](https://doi.org/10.1109/FCCM62733.2025.00014)

* **ENABOL: Enabling Stable On-Chip Learning via Adaptive Lipschitz Budgeting**  
  M. B. Valentín, **Houxuan Guo**, R. Forelli, E. Gindlesperger, and S. Ogrenci  
  *Design, Automation and Test in Europe (DATE)*, 2027 *(Under Review)*

### Journals
* **NetSuRF: A Resource-Aware Fault-Tolerant Design Flow for Machine Learning on Edge Devices**  
  M. B. Valentín, **Houxuan Guo**, X. He, and S. Ogrenci  
  *IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems (TCAD)*, 2026 *(Under Review)*

<!--
## Researches

### ENABOL: On-Device ML Training & Backpropagation Framework
*Jun. 2024 -- Present*
* Developed an end-to-end Python/C++ HLS flow extending `hls4ml`, enabling on-device backpropagation and fixed-point weight updates directly on resource-constrained edge hardware.
* Formulated a Lipschitz-bounded operator projection method in PyTorch, mitigating gradient explosion and maintaining training convergence under strict 8-bit/16-bit fixed-point precision.
* Built data preparation pipelines to generate synthetic calibration distributions, achieving training parity with FP32 baselines while reducing hardware memory footprint by over 40%.

### NetSuRF: Fault-Tolerant Toolchain for Edge-AI Accelerators
*Jun. 2024 -- May 2025*
* Architected an automated Python framework applying selective redundancy (TMR) across neural network layers to harden edge models against bit-level transient faults under tight PPA budgets.
* Constructed a statistical weight-sensitivity profiler evaluating fault propagation across model parameters to minimize protection overhead.
* Synthesized multi-dimensional trade-off curves across Power, Performance, and Area (PPA), validating model resilience across Edge FPGA and ASIC deployment targets.

### Real-Time Multimedia Processing Datapath & UVM Verification
*Feb. 2024 -- Mar. 2024*
* Implemented a pipelined Sobel edge-detection engine with grayscale conversion and an asynchronous FIFO-backed UDP packet parser for real-time PCAP multimedia streaming.
* Built a modular UVM verification environment from scratch with constrained-random stimulus and functional coverage monitors, achieving 100% functional and code coverage.
-->

## Experience

### Fermi National Accelerator Laboratory (Fermilab)
**Visiting Researcher** | Batavia, IL  
*Jul. 2023 -- Present*
* **ML Accelerator Co-Design:** Validated Cryo-AI ASIC for sub-millisecond edge neural network inference; executed post-silicon functional bring-up of core logic and high-speed I/O channels.
* **ML Compiler & Framework Integration:** Integrated `hls4ml` neural network compiler with the ESP SoC platform to automate mapping and fixed-point quantization of PyTorch/ONNX models into custom hardware accelerators.
* **High-Throughput Data Interface:** Built streaming data verification testbenches for photonic mixed-signal blocks, optimizing data conversion throughput and signal integrity.


## Education

* **Northwestern University**
  Ph.D. Candidate in Computer Engineering *(Present)*  
* **Northwestern University**
  M.S. in Electrical Engineering *(2023)*
* **University of Shanghai for Science and Technology**
  B.E. in Electrical Engineering *(2022)*

## Skills

* **Machine Learning & Systems:** PyTorch, ONNX, Quantization-Aware Training (QAT), Pruning, On-Device Learning, `hls4ml`, Keras/TensorFlow, Model Compression
* **Languages & Scripting:** Python (NumPy, SciPy), C/C++, SystemVerilog, Verilog, CUDA, MATLAB, Bash, Tcl, Git, Linux
* **Hardware Architecture:** Edge AI Accelerators, FPGA (Vivado, Vitis), High-Level Synthesis (HLS), Fixed-Point Arithmetic, ASIC/SoC Co-Design, UVM, ESP SoC Platform
* **EDA Tools:** Cadence (Genus, Innovus, Xcelium, Virtuoso), Synopsys (Design Compiler, VCS), Siemens Questa

