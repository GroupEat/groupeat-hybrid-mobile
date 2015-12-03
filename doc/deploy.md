# Deploy

## Building

Building should be performed for each platform by using the following flags

| Flag/Option          | Values                                 | Default                         |
| -------------------- |:--------------------------------------:| -------------------------------:|
| `--env`              | `production`                           | `staging` (will not work)       |
| `--compress`         | Boolean                                | false except for production env |
| `--platform`         | `ios`,`android`                        | `ios`                           |

```
gulp package:build --env production
```

The build will be performed on Ionic.io servers. Available envs can be added on the Ionic.io platform but only production is available right now, with the usual passwords for the security files (ios certificate and provisioning profile as well as android keystore).

## Checking on builds

Checking the status of all builds

```
gulp package:list
```

Checking on the status of a build (including failure details)

```
gulp package:info --id <buildId>
```

## Downloading a build

`.ipa` or `.apk` files will be downloaded (if listed a a build success) to the `dist` folder by using

```
gulp package:download --id <buildId>
```
