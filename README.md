# domaparte
Home automation for my apartment

# Docker
It's easier to have Docker to run this project 
If you are on windows, like me, I advise you to use docker directly in a linux distribution (ubuntu for me) via wsl2
In development, the first time build the image, and run it:

  - docker build -f Dockerfile.dev -t domaparte/dev .
  - docker run -p 3000:3000 -p 10000:10000 -v $(pwd):/app -it domaparte/dev sh

For information we open port 3000 for serve the application and port 10000 for rollup auto reload

next, inside the container:
  - npm install
  - npm run dev
  - open your favorite browser on localhost:3000
  - voilà !

If you don't want to use docker, just look in the dockerfile to know which node version is required, but you may have some surprises, because the windows and the linux date management are not the same, and we use Dates with temperature