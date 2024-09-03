# Electron V8 snapshot experiment

This experiment shows how you can use V8 snapshot to speed up the `require()`s for the main process of your Electron application by **more than 80%!**

(All measurements have been peformed on an `x86_64` macOS running Sonoma `14.6.1`.)

## Before using V8 snapshot

![](before.png)

|||
|-|-|
|Total startup time|426ms|
|Total `require()`s time|215ms|
|Electron startup time|211ms|
|Electron binary size|227MB|

## After using V8 snapshot

![](after.png)

|||
|-|-|
|Total startup time|272ms|
|Total `require()`s time|41ms|
|Electron startup time|231ms|
|Electron binary size|238MB|

## Results

This has successfully removed 81% of the time spent running all the `require()`s causing an overall 36% performance improvement to the total startup time with minor changes to the Electron startup time and binary sizes!

||Before|After|Difference|% change|
|-|-|-|-|-|
|Total startup time|426ms|272ms|154ms|36%|
|Total `require()`s time|215ms|41ms|174ms|81%|
|Electron startup time|211ms|231ms|-20ms|-10%|
|Electron binary size|227MB|238MB|-11MB|-5%|

## Explanation

[`main.js`](main.js) is the code for a typical Electron application that `require()`s a bunch of JS dependencies, runs some setup code and then opens a window. Of the total 426ms startup time, the `require()`s alone take up 215ms, which is 50%! We can reduce this further by using V8 snapshot.

```mermaid
flowchart TD

subgraph Dependency installation
  yarn -- installs --> node_modules
  node_modules -- manually copied over --> unsnapshottable.js
  node_modules -- patch-package --> snapshottable-code["snapshottable code"]
end

subgraph Generating the snapshot
  snapshot.js -- require(...) --> snapshottable-code
  snapshot.js -- electron-link --> cache/snapshot.js
  cache/snapshot.js -- electron-mksnapshot --> v8_context_snapshot.x86_64.bin & snapshot_blob.bin
  v8_context_snapshot.x86_64.bin -- renamed --> browser_v8_context_snapshot.bin
  browser_v8_context_snapshot.bin -- copied into --> electron-bundle["electron bundle"]
  electron-fuses["@electron/fuses"] -- flip LoadBrowserProcessSpecificV8Snapshot fuse to true --> electron-bundle
end

subgraph App using the snapshot
  electron -- loads --> browser_v8_context_snapshot.bin
  electron -- runs --> main.js -- runs --> v8-snapshots-util.js
  v8-snapshots-util.js -- monkey-patches --> require["require(...)"] -- load modules from --> browser_v8_context_snapshot.bin
  main.js -- hydrates the snapshot --> unsnapshottable.js
  main.js --> require
end
```

Let's break this down!

### Dependency installation

```mermaid
flowchart TD

yarn -- installs --> node_modules
node_modules -- manually copied over --> unsnapshottable.js
node_modules -- patch-package --> snapshottable-code["snapshottable code"]
```

When `yarn` is run, it installs the dependencies of the project and also runs the postinstall script to patch the installed packages.

https://github.com/RaisinTen/electron-snapshot-experiment/blob/e95111b260dfbb7bd17b0ccb499478bbe8e4ef45/package.json#L16

.
