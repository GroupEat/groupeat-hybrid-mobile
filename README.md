# GroupEat Hybrid Mobile Application

[![Build Status](https://magnum.travis-ci.com/GroupEat/groupeat-hybrid-mobile.svg?token=QRmpFsqtUNJgQHQ5YEdF&branch=master)](https://magnum.travis-ci.com/GroupEat/groupeat-hybrid-mobile)

[![Build Status](https://api.shippable.com/projects/546a96c3d46935d5fbbddccc/badge?branchName=master)](https://app.shippable.com/projects/546a96c3d46935d5fbbddccc/builds/latest)

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
    
You might also need to install the fonts used by our app. To do that, browse into app/fonts and double click on each .otf and .ttf files to install them on your machine.

## Before Making a Commit

Always run the following command before commiting, to make sure the code does not include
parse errors or warnings, as well as to be sure unit tests pass.

    grunt
