# GroupEat Hybrid Mobile Application

[![Circle CI](https://circleci.com/gh/GroupEat/groupeat-hybrid-mobile.svg?style=svg&circle-token=4ff988233381647a057129f73cf1cfb97007bd57)](https://circleci.com/gh/GroupEat/groupeat-hybrid-mobile)    [![Code Climate](https://codeclimate.com/repos/54ad15d4695680573000abb4/badges/eff72be7b75e406f0908/gpa.svg)](https://codeclimate.com/repos/54ad15d4695680573000abb4/feed)    [![Test Coverage](https://codeclimate.com/repos/54ad15d4695680573000abb4/badges/eff72be7b75e406f0908/coverage.svg)](https://codeclimate.com/repos/54ad15d4695680573000abb4/feed)



## Prerequisites

### Ruby and RubyGems

Ruby and RubyGems come preinstalled on Mac OSX.

On Ubuntu, run

    sudo apt-get install ruby-full rubygems

On Windows, check out [RubyInstaller](http://rubyinstaller.org/) and make sure you also install RubyGems.

### Compass

    gem install compass

You might not have write access to your Library/Ruby/Gems/ directory. If so, try
    
    sudo gem install compass
    

### Node.js and Global Dependencies

On all platforms, the best option is to check out [Node.js](http://nodejs.org/).
Then run the following command to install the needed dependencies

    sudo npm install -g bower
    sudo npm install -g grunt-cli

## Install

    git clone https://github.com/GroupEat/groupeat-hybrid-mobile
    cd groupeat-hybrid-mobile
    npm install
    bower install
    grunt serve

## Resources

### Icons & Splash
To include the app icons and splashscreens for all devices run the following command before building the app for a platform :
    
    ionic resources
    
Should this command fail, make sure that your ionic CLI is higher than 1.2.14

## Before Making a Commit

Always run the following commands before commiting :

    grunt
 
 To make sure the code does not include parse errors or warnings, as well as to be sure unit tests pass.
 
    ionic build android (ios) ; ionic emulate android (ios)
    
 To see what really happens on a real emulator.
