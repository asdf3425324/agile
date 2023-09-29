rm -rf ./backend/public
cd ./frontend && yarn build
mv ./build ../backend/public

