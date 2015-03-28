import fnmatch
import os
import shutil

matches = []
for root, dirnames, filenames in os.walk('../'):
  for filename in fnmatch.filter(filenames, 'LICENSE'):
    matches.append(os.path.join(root, filename))
for match in matches:
  splittedPath = match.split('/')
  licenseName = splittedPath[len(splittedPath)-2]
  licenseFile = './' + licenseName + '.license'
  shutil.copy2(match, licenseFile)
  
