# imgFormatter

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white) ![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

## Description

This project consists in an app built with Rust + Tauri + React/Typescript, that provides
a graphical user interface to manipulate [cwebp](https://developers.google.com/speed/webp/docs/cwebp) operations. 

The idea is to make it even easier to convert an image format to .webp, with the already extraordinary tool that is the **cwebp**.

It also let the user to change the dimension, quality and other available options
from **cwebp**, and even do that with a set of images.

---

### Notes

The **cwebp** executable bundled in this project is part of the **libwebp**
 library, developed by the **WebM Project**.

**cwebp** is licensed under the **BSD 3-Clause License**. The full license text is included in the [cwebp-LICENSE](./src-tauri/bin/cwebp-LICENSE.txt) file bundled alongside the executable.
