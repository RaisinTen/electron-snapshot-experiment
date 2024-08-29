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

||Before|After|% change|
|-|-|-|-|
|Total startup time|426ms|272ms|36%|
|Total `require()`s time|215ms|41ms|81%|
|Electron startup time|211ms|231ms|-10%|
|Electron binary size|237MB|238MB|-5%|

## Explanation

[`main.js`](main.js) is the code for a typical Electron application that `require()`s a bunch of JS dependencies, runs some setup code and then opens a window. Of the total 426ms startup time, the `require()`s alone take up 215ms, which is 50%! We can reduce this further by using V8 snapshot.

TODO(RaisinTen): Add more explanation.

TODO(RaisinTen): The total `require()`s time can be further reduced. Do that.
