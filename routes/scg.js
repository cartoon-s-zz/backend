const express = require('express');
const router = express.Router()
var request = require('request');
var _ = require('lodash');

router.get('/findxyz', findxyz);
router.get('/findingRestaurant', findingRestaurant);

async function findxyz(req, res) {
  const arr = ['x', 5, 9, 15, 23, 'y', 'z'];
  let mul = 2;
  let indexOfX;
  let indexOfY;
  let indexOfZ;
  arr.find(function (value, index) {
    console.log(value);
    console.log(index);
    if (value === 'x') {
      indexOfX = index;
      if (indexOfX > 0) {
        let value = arr[indexOfX - 1] + (mul * indexOfX);
        arr[indexOfX] = value;
      } else {
        let value = arr[indexOfX + 1] - (mul * (indexOfX + 1));
        arr[indexOfX] = value;
      }
    }
    if (value === 'y') {
      indexOfY = index;
      if (indexOfY > 0) {
        let value = arr[indexOfY - 1] + (mul * indexOfY);
        arr[indexOfY] = value;
      } else {
        let value = arr[indexOfY + 1] - (mul * (indexOfY + 1));
        arr[indexOfY] = value;
      }
    }
    if (value === 'z') {
      indexOfZ = index;
      if (indexOfZ > 0) {
        let value = arr[indexOfZ - 1] + (mul * indexOfZ);
        arr[indexOfZ] = value;
      } else {
        let value = arr[indexOfZ + 1] - (mul * (indexOfZ + 1));
        arr[indexOfZ] = value;
      }
    }
  })
  console.log('arr', arr);

  let data = {
    'x': arr[indexOfX],
    'y': arr[indexOfY],
    'z': arr[indexOfZ]
  }
  return res.send({ result: data });
}

async function findingRestaurant(req, res) {
  let YOUR_API_KEY = 'AIzaSyB5IlVNYMbdKdh-Ika4ZvnOCztHWhItyKw';
  let lat = 13.804983;
  let lng = 100.536200;
  // let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants&location=${lat},${lng}radius=10000&key=${YOUR_API_KEY}`;
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&type=restaurant&key=${YOUR_API_KEY}`
  let data = [];
  request(url, function (error, response, body) {
    if (error) {
      throw error; //error happen
    }
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('data=====>', body)
    var obj = JSON.parse(body);
    for (let i of obj.results) {
      let temp = {
        vicinity: i.vicinity,
        rating: i.rating,
        name: i.name
      }
      data.push(temp);
    }
    let url2 = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat + 0.001},${lng + 0.015}&radius=1000&type=restaurant&key=${YOUR_API_KEY}`

    request(url2, function (error, response, body) {
      if (error) {
        throw error; //error happen
      }
      var obj = JSON.parse(body);
      // console.log(body);
      for (let i of obj.results) {
        // console.log(i.name);
        let temp = {
          vicinity: i.vicinity,
          rating: i.rating,
          name: i.name
        }
        data.push(temp);
      }
      return res.send(_.uniqBy(data));
    });
  });

}



export default router;