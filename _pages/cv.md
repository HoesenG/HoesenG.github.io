---
permalink: /cv/
title: "CV"
excerpt: "Curriculum vitae of Houxuan Guo."
author_profile: true
redirect_from:
  - /resume
---

{% assign cv_pdf = site.static_files | where: "path", "/files/cv.pdf" | first %}
{% if cv_pdf %}<a class="btn btn--primary" href="{{ site.baseurl }}/files/cv.pdf">Download PDF</a>{% endif %}

## Education

<div class="cv-entry">
  <div class="cv-entry__head"><strong>Northwestern University</strong><span class="cv-entry__date">Present</span></div>
  <div>Ph.D. Candidate in Computer Engineering</div>
</div>
<div class="cv-entry">
  <div class="cv-entry__head"><strong>Northwestern University</strong><span class="cv-entry__date">2023</span></div>
  <div>M.S. in Electrical Engineering</div>
</div>
<div class="cv-entry">
  <div class="cv-entry__head"><strong>University of Shanghai for Science and Technology</strong><span class="cv-entry__date">2022</span></div>
  <div>B.E. in Electrical Engineering</div>
</div>

## Experience

<div class="cv-entry">
  <div class="cv-entry__head"><strong>Fermi National Accelerator Laboratory (Fermilab)</strong><span class="cv-entry__date">Jul. 2023 – Present</span></div>
  <div>Visiting Researcher · Batavia, IL</div>
</div>

* **ML Accelerator Co-Design:** Validated the Cryo-AI ASIC for sub-millisecond edge neural network inference; executed post-silicon functional bring-up of core logic and high-speed I/O channels.
* **ML Compiler & Framework Integration:** Integrated the `hls4ml` neural network compiler with the ESP SoC platform to automate mapping and fixed-point quantization of PyTorch/ONNX models into custom hardware accelerators.
* **High-Throughput Data Interface:** Built streaming data verification testbenches for photonic mixed-signal blocks, optimizing data conversion throughput and signal integrity.

## Publications

{% include publication-list.html %}

## Skills

* **Machine Learning & Systems:** PyTorch, ONNX, Quantization-Aware Training (QAT), Pruning, On-Device Learning, `hls4ml`, Keras/TensorFlow, Model Compression
* **Languages & Scripting:** Python (NumPy, SciPy), C/C++, SystemVerilog, Verilog, CUDA, MATLAB, Bash, Tcl, Git, Linux
* **Hardware Architecture:** Edge AI Accelerators, FPGA (Vivado, Vitis), High-Level Synthesis (HLS), Fixed-Point Arithmetic, ASIC/SoC Co-Design, UVM, ESP SoC Platform
* **EDA Tools:** Cadence (Genus, Innovus, Xcelium, Virtuoso), Synopsys (Design Compiler, VCS), Siemens Questa
