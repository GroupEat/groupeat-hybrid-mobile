# Running

## Flags and options

For all the following commands used to run the application, the following flags and options are available :

| Flag/Option          | Values                                 | Default   |
| -------------------- |:--------------------------------------:| ---------:|
| `--compress`         | N/A                                    | false     |
| `--env`              | `development`, `staging`, `production` | `staging` |

## Browser

    grunt serve

## iOS

### Prerequisites

You need to add the platform by running

    grunt platform:add:ios

If you wish to run the application on an actual device, you need to have installed the `DeveloperProfile.developerprofile` file present in the team's Google Drive.

The following npm package is also needed to run it on the device without using XCode

    npm install -g ios-deploy

### Emulation

    grunt emulate:ios

### On Device

    grunt run:ios

You can also build the application, and open the `platforms/ios/GroupEat.xcodeproj`
file with XCode before building it.

## Android

### Prerequisites

You need to add the platform by running

    grunt platform:add:android

Rest of the documentation to come. For now, you can rely on the used generator documentation
for reference : [Generator Ionic](https://github.com/diegonetto/generator-ionic)
