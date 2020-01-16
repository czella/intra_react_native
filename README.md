# Start Application Locally

Install dependencies

```bash
npm install
```

Start the application:

```bash
npm start
```

# Run Application on IOS

Don't open in Xcode, install podfiles:

```bash
cd ios && pod repo update && pod install && pod update
```

In root folder run:

```bash
react-native run-ios
```

# Run Application on Android

Create local.properties file in android folder. Add this line:

```bash
sdk.dir = <YOUR_ANDROID_SDK_PATH_GOES_HERE>
```

In root folder run:

```bash
react-native run-android
```
