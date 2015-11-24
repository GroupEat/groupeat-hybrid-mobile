# Running

## Flags and options

For all the following commands used to run the application, the following flags and options are available :

| Flag/Option          | Values                                 | Default                         |
| -------------------- |:--------------------------------------:| -------------------------------:|
| `--env`              | `development`, `staging`, `production` | `staging`                       |
| `--compress`         | Boolean                                | false except for production env |

## Browser

    gulp watch

## iOS

### Prerequisites

If you wish to run the application on an actual device, you need to have installed the `DeveloperProfile.developerprofile` file present in the team's Google Drive.

The following npm packages are also needed to run it and emulate it on the device without using XCode

    npm install -g ios-deploy ios-sim

### Emulation

    gulp emulate --platform ios

### On Device

    gulp run --platform ios

You can also build the application, and open the `platforms/ios/GroupEat.xcodeproj`
file with XCode before building it.

## Android

### Prerequisites

You need to add the platform by running

    gulp platform:add --platform android@5.0.0
