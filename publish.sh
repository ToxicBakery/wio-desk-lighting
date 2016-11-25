rm -rf dest
cp -R src dest
cd dest && npm install --production && cd ..
gulp
