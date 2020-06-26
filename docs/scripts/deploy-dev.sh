grunt build.dev --gruntfile grunt.docs.js
rm -rf ../trails-server/build
mv build ../trails-server/build
cd ../trails-server
git add -A
git commit -m "build-dev script"
git push origin master
