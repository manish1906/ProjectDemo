grunt build.prod --gruntfile grunt.at.js
rm -rf ../trails-server-prod/build
mv build ../trails-server-prod/build
cd ../trails-server-prod
git add -A
git commit -m "build-prod script"
git push origin master
