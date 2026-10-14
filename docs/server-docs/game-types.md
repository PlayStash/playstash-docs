---
sidebar_position: 2.6
---

# Game types

A game type describes how a client should install or launch a package. The backend detects it from a filename override, manifest or executable names. It never executes the installation itself.

| Type | Filename tag | Detection/use |
| --- | --- | --- |
| `WINDOWS_SETUP` | `(W_S)` | Windows installer: setup/autorun/install/unarc executable or an installer MSI. Single `.exe` files default to this type. |
| `WINDOWS_PORTABLE` | `(W_P)` | Windows executable package with no detected setup pattern. |
| `WINDOWS_SOFTWARE` | `(W_SW)` | Explicitly tagged Windows software/tool package. |
| `LINUX_PORTABLE` | `(L_P)` | Shell script/AppImage package without a Windows executable; single `.sh`/`.appimage` files also use this type. |
| `LINUX_SOFTWARE` | `(L_SW)` | Explicitly tagged Linux software/tool package. |
| `UNDETECTABLE` | No type tag | No supported executable pattern was detected; install/select executables manually in the client. |

Installer detection recognizes `setup.exe`, `autorun.exe`, `setup_*.exe`, `setup-*.exe`, `install.exe`, `unarc.exe`, and `.msi` names that do not identify redistributables. Nested archives are not inspected recursively for executable detection.

Use only one type tag. A manifest's `type` can use one of the enum names above; see [package manifests](packages.md). A macOS installer for the PlayStash **client** does not imply an additional macOS game-type enum. Actual game compatibility depends on the target system, game and client runtime.
