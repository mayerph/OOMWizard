# OOMWizard
## Installation
### Docker
#### I. Clone Repository
    git clone https://github.com/mayerph/OOMWizard.git

#### II. Edit backend config
1. Open ./backend/src/config.json
2. set database.local to false

        {
            "database" : {
                "path_local" : "mongodb://localhost:27017/meme",
                "path" : "mongodb://mongo:27017/meme",
                "local" : false
            },
            ...    
        }

#### III. Execute docker-compose
1. docker-compose up
2. wait until installation finishes. This will take some time. Go and get a coffee. <span>&#x2615;</span>


#### IV. View Frontend
- http://localhost:3000

#### V. View Backend
- http://localhost:2000

### Local
#### I. Install dependencies
1. Install ffmpeg:
   
        https://ffmpeg.org/

2. Install rust

        https://www.rust-lang.org/tools/install

3. Install neon bindings

        https://neon-bindings.com/docs/getting-started/

4. Install node

        https://nodejs.org/en/

5. Install react

        https://reactjs.org/

6. Install mongodb

        https://docs.mongodb.com/manual/installation/




#### II. Backend preparation
1. Go to ./backend
2. Open ./src/config.json
3. set database.local to false

        {
            "database" : {
                "path_local" : "mongodb://localhost:27017/meme",
                "path" : "mongodb://mongo:27017/meme",
                "local" : true
            },
            ...    
        }
4. Specify location of ffmpeg and ffprobe
   
        {
            ...,
            "ffmpeg" : {
                "ffmpeg" : "ffmpeg",
                "ffprobe" : "ffprobe"
            },
            ...
        }

5. npm install
6. npm run start

#### IV. Frontend preparation
1. Go to ./frontend
2. npm install
3. npm run start

#### V. Start MongoDB

#### VI. View Frontend
- http://localhost:3000

#### VII. View Backend
- http://localhost:2000