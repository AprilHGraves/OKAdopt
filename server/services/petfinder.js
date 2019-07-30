const request = require('request-promise');
const keys = require('../../config/keys');

let _token = null;
const getToken = async () => {
  if (_token){
    return _token;
  }

  try {
    const authResponse = await request({
      method: 'POST',
      url: 'https://api.petfinder.com/v2/oauth2/token',
      formData: {
        grant_type: "client_credentials",
        client_id: keys.ADOPT_KEY,
        client_secret: keys.ADOPT_SECRET
      }, 
      json: true
    })
    _token = authResponse.access_token;

    setTimeout(() => {
      _token = null;
    }, 1000*60*30)

    return _token; 

  } catch(err) {
    console.log(err)
  }
}

// const searchByBreedAndLoc = async(breed, location) => {
//   const token = await getToken();

//   // sanitize user input
//   breed = encodeURIComponent(breed);
//   location = encodeURIComponent(location);

//   const result = await request({
//     method: 'GET',
//     url: `https://api.petfinder.com/v2/animals?type=dog&location=${location}&breed=${breed}`,
//     auth: { bearer: token, sendImmediately: true },
//     json: true
//   })

//   return result;
// }


//shape dog data
const dogTransform = (dog) => {
  let photoUrl = null;
  if (dog.photos[0]){
    photoUrl = dog.photos[0].full;
  } 

  return {
    id: dog.id,
    age: dog.age,
    gender: dog.gender,
    size: dog.size,
    name: dog.name,
    description: dog.description,
    photoUrl: photoUrl,
    breeds: dog.breeds,
    colors: dog.colors,
    coat: dog.coat,
    environment: dog.environment
  }
} 

// remove dogs from result that don't have photos
const dogListTransform = (dogs) => {
  dogs = dogs.map(dogTransform);
  return dogs.filter(dog => dog.photoUrl);
}

const getShibas = async () => {
  const token = await getToken();

  // sanitize user input
  let breed = encodeURIComponent("shiba inu");

  const result = await request({
    method: 'GET',
    url: `https://api.petfinder.com/v2/animals?type=dog&breed=${breed}`,
    auth: { bearer: token, sendImmediately: true },
    json: true
  })

  return dogListTransform(result.animals);
}


module.exports = { getShibas }