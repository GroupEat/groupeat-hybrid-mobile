# Installation

## Prerequisites

### Ruby and RubyGems

Ruby and RubyGems come preinstalled on Mac OSX.

On Ubuntu, run

    sudo apt-get install ruby-full rubygems

On Windows, check out [RubyInstaller](http://rubyinstaller.org/) and make sure you also install RubyGems.

### Compass

You might need to add sudo to this command

    gem install compass

### Node.js and Global Dependencies

On all platforms, the best option is to check out [Node.js](http://nodejs.org/).
Then run the following command to install the needed dependencies (might need to add sudo)

    npm install -g bower grunt-cli

## Install

    git clone git@github.com:GroupEat/groupeat-hybrid-mobile.git
    cd groupeat-hybrid-mobile
    npm install
