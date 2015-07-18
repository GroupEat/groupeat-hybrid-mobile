# Worflow

## Creating the branch

Pick a ticket and remember its id. For instance, issue 274 is 'Install Ionic Analytics'.

Create a branch whose name contains the issue id preceded by a #, and brief keywords describing the issue. For instance :

    git checkout -b #274-ionic-analytics

You can then push the branch to the server, to self-assign the issue and place it in progress.

    git push --set-upstream origin #274-ionic-analytics

## Development

Try to group code changes thematically in commits, by for instance using `git add -p`. Once all the changes are staged, you can commit with a message as explicit as possible about what changes were made

    git commit -m "Installs and configures the needed ionic libraries"

Once you're done with all the commits, you can push the code to Github. Make sure that all tests pass, and if possible test as much of the new code as possible.

    git push

## Creating a Pull Request

Create your pull request only once you are confident that the feature stated in the issue is present on your branch. The pull request must include in its title 'Closes #274' (replace 274 with the id of the issue) but can also repeat the title of the issue for clarity. The issue will be moved automatically in the Code Review column and the pull request will be attached to it.

## Code Review

Post the link to the pull request on Slack so that someone can review it. The reviewer must read the pull request entirely and put comments when needed.

Once he is done reading, he needs to add a comment including :+1: to notify the developer that he finished reviewing the Pull Request. The developer can bring changes to take into account the reviewing, and notify the code reviewer of the changes, and so forth.

## Merging

Once code reviewing and done and if the tests are passing, the Pull Request can be merged. The issue will be automatically moved to "Done".
