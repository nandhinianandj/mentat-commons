---
title: flashing my sony neo V phone
abstract: Auditing recovery scripts and toolchains to flash CyanogenMod 10 on a Sony
  Neo V phone.
problem: Status 7 installation aborts due to model mismatch validation checks (haida
  vs hallon).
context: Cross-compiling from x86_64 Trisquel GNU/Linux to ARM architecture using
  CWM recovery.
key_ideas:
- Bypassing recovery assertions
- Cross-compiling Toolchains
- Objdump debugging of 32-bit binaries
lessons: Investigate updater log assertions when flashing cross-compiled kernels.
related_articles:
- write-sony-ericsson-service
related_projects:
- proj-waste-detection
related_skills:
- Systems Design
related_talks: []
career_axes:
- axis-i
reading_time: 4 mins
evidence_links:
- https://softwaremechanic.wordpress.com/2013/04/12/flashing-my-sony-neo-v-phone/
tags:
- ROM Flashing
- Android
- Linux
- Cross Compilation
featured: false
---

In a fit of bravery/stupidity(you pick :)), i decided to flash my phone with cyanogenmod. and being the naive idiot i am ended up with something that just doesn’t boot and seems to get stuck at the boot screen splash page with FreeXperia logo. After some more mistakes(i.e using haida vs hallon etc..) i finally got some boot.img flashed that lets me login and make changes via the clockwork mod recovery manager at boot time. but still despite trying a few other images, i can’t get to a bootable OS. After lots of search, download, install, boot, and failures, i decided enough is enough, it’s time to try my hand and building an OS from source. I remembered my love for mozilla and decided to try Firefox OS. Unfortunately my device is not supported. Darn. not to be disappointed, i decided, i’ll 

...[Full content preserved in source]