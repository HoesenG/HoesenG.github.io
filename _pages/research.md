---
permalink: /research/
title: "Research"
excerpt: "Research projects by Houxuan Guo."
author_profile: true
---

## ENABOL: On-Device ML Training and Backpropagation
<p class="project__meta">Jun. 2024 – Present · Related paper: <em>ENABOL</em>, DATE 2027 (under review)</p>

* Developed an end-to-end Python/C++ HLS flow extending `hls4ml`, enabling on-device backpropagation and fixed-point weight updates directly on resource-constrained edge hardware.
* Formulated a Lipschitz-bounded operator projection method in PyTorch, mitigating gradient explosion and maintaining training convergence under strict 8-bit/16-bit fixed-point precision.
* Built data preparation pipelines to generate synthetic calibration distributions, achieving training parity with FP32 baselines while reducing hardware memory footprint by over 40%.

## NetSuRF: Fault-Tolerant Toolchain for Edge-AI Accelerators
<p class="project__meta">Jun. 2024 – May 2025 · Related paper: <em>NetSuRF</em>, IEEE TCAD 2026 (under review)</p>

* Architected an automated Python framework applying selective redundancy (TMR) across neural network layers to harden edge models against bit-level transient faults under tight PPA budgets.
* Constructed a statistical weight-sensitivity profiler evaluating fault propagation across model parameters to minimize protection overhead.
* Synthesized multi-dimensional trade-off curves across power, performance, and area (PPA), validating model resilience across edge FPGA and ASIC deployment targets.

## Real-Time Multimedia Processing Datapath and UVM Verification
<p class="project__meta">Feb. 2024 – Mar. 2024</p>

* Implemented a pipelined Sobel edge-detection engine with grayscale conversion and an asynchronous FIFO-backed UDP packet parser for real-time PCAP multimedia streaming.
* Built a modular UVM verification environment from scratch with constrained-random stimulus and functional coverage monitors, achieving 100% functional and code coverage.
