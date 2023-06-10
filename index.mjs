import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import fs from 'fs';
import axios from 'axios';
import * as url from 'url';

var imgID = '';
var imgDownload = '';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const folder_path = __dirname + "\wallpapers"; //"C:/Users/maria/Desktop/wallpapers"; //__dirname + "\wallpapers";
console.log(folder_path);
const key = 'smzhjuVOjBzv1D2N8Pie1qoUNRJEqNJmBWBE11AvPyA';
const queries = [
                    'dog', 'cat', 'nature', 'landscape', 'wildlife',
                    'beach', 'skyline', 'forest', 'bird', 'night sky', 
                    'space', 'animals', 'plants', 'architecture', 'ocean', 
                    'mountains', 'winter', 'summer', 'autumn', 'spring'
                ];
const minutes = 1;
const interval = minutes * 60 * 1000;
const FILE_MAX = 20;

const unsplash = createApi({
    accessKey: `${key}`,
    fetch: nodeFetch,
  });

getPhoto(() => deleteImages());

setInterval(function() {
    console.log("grabbing new photo from unsplash.");
    //getPhoto(() => console.log(`will run again in ${minutes} minutes.`));
    getPhoto(() => deleteImages());

}, interval);


export function deleteImages() {
        console.log(`will run again in ${minutes} minutes.`);
        var file_to_remove = '';
        fs.readdir(folder_path, (err, files) => {
            if (files.length > FILE_MAX) {
                
                //trash random file
                var queryId = 0;
                queryId = Math.floor(Math.random() * (files.length - 1));
                console.log("Picked File: " + (queryId) + '/' + (files.length - 1));
                file_to_remove = files[queryId];
                console.log(file_to_remove);

                if (file_to_remove !== '') {
                    var remove_path = folder_path + '\\' + `${file_to_remove}`
                    console.log("removing file... " + remove_path)
                    fs.unlink(remove_path, () => console.log("deleted"));
                }
            }
        }); 
    }


var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
    
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

export function getPhoto(_callback) {
    var queryId = 0;
    queryId = Math.floor(Math.random() * (queries.length - 1));
    console.log(queryId + '/' + (queries.length - 1) + ' : ' + queries[queryId]);

    unsplash.photos.getRandom({featured: true, query: queries[queryId], orientation: 'landscape'}).then(result => {
        if (result.errors) {
            // handle error here
            console.log('error occurred: ', result.errors[0]);
        } else {
            // handle success here
            const photo = result.response;
            imgDownload = photo["links"]["download"];
            imgID = photo["id"];
            //console.log(photo);
        }
        console.log(`ID: ${imgID}`);
        console.log(`download link: ${imgDownload}`);

        (async () => {
            let example_image_1 = await download_image(`${imgDownload}?client_id=${key}`, `${folder_path}/${imgID}.png`);
          
            console.log("done"); // true
            _callback();
        })();
    });
    
}


/* ============================================================
  Function: Download Image
============================================================ */

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );