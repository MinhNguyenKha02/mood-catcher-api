# mood-catcher-api

~~ Where wireless waves/signals cooks, flexibility for sound platform, networking software, SaaS...

! Prerequisites

- Node.js: 16.x and do not assume (compatibility).
- Vosk (development version): vosk-model-small-en-us-0.15


! How to

1. ```npm install``` or ```npm ci``` (production)
2. ```npm run build``` (or ```ts-node``` for direct run)
3. ```npm run dev``` or ```npm start``` (optional ```npm test```)


! .env for example 

``` 
PORT=3000
MODEL_PATH=vosk-model/vosk-model-small-en-us-0.15
SAMPLE_RATE=16000
```