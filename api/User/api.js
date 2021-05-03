import axios from 'axios';
import { ApiURL } from '.././credentials';
//#region USER API CALLS

  ////#region LOGIN AND REGISTRATION
  export async function Login(user){
    let data = {
      success: false,
      data: ''
    }
    await axios.post(ApiURL + 'user/login', user)
    .then(function (response) {
        // handle success
        data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
         data = {
            success: false, 
            data: error
          }
        }
         data = {
          success: false, 
          data: error
        }
    })
    console.log("Login API call response is: ", data, " Data Sent for the call: ", user)
    return data;
  }

  export async function Register(user){
    let data = {
      success: false,
      data: ''
    }
    await axios.post(ApiURL + 'user', user)
    .then(function (response) {
        // handle success
        console.log('Registration Response is:', response.data);
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }

  export async function UpdateProfile(user){
    let data = {
      success: false,
      data: ''
    }
    console.log('Data passed to UpdateProfile Is:', user)
    await axios.post(ApiURL + 'user/profile/update', user)
    .then(function (response) {
        // handle success
        console.log('API.js: Update Profile Response is:', response.data);
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          console.log('Profile Update failed with: ', error.response)
          return data = {
            success: false, 
            data: error.response
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }

  export async function GetProfile(user){

    let data = {
      success: false,
      data: ''
    }
    console.log('Data passed to ProfileGet is:', user)
    await axios.post(ApiURL + 'user/profile/get', user)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error.response
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }

  export async function ValidateToken(user){

    let data = {
      success: false,
      data: ''
    }
    await axios.post(ApiURL + 'user/compareToken', user)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error.response
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }
  ////#endregion 

  ////#region Hotel API Calls

  export async function GetHotels(params){
    let data = {
      success: false,
      data: ''
    }
    console.log('Data passed to getHotels is:', params)
    await axios.post(ApiURL + 'organization/getlist', params)
    .then(function (response) {
        // handle success
        console.log('API.js: Hotel ListGet Response is:', response.data);
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }

  export async function AddFavorite(params){
    let data = {
      success: false,
      data: ''
    }
    console.log('Data passed to GetFavorite is:', params)
    await axios.post(ApiURL + 'user/favorite', params)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }

  export async function GetFavorite(params){
    let data = {
      success: false,
      data: ''
    }
    console.log('Data passed to GetFavorite is:', params)

    await axios.post(ApiURL + 'user/favorite/get', params)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }

  export async function AddCheckIn(params){
    let data = {
      success: false,
      data: ''
    }
    console.log('API.js: Data passed to AddCheckIn:', params)
    await axios.post(ApiURL + 'user/checkin', params)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }
  export async function AddReview(params){
    let data = {
      success: false,
      data: ''
    }
    console.log('Data passed to AddReview is:', params)
    await axios.post(ApiURL + 'reviews', params)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }

  export async function AddReviewReport(params){
    let data = {
      success: false,
      data: ''
    }
    console.log('Data passed to AddReviewReport is:', params)
    await axios.post(ApiURL + 'reviews/report', params)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }

  export async function GetReviews(params){
    let data = {
      success: false,
      data: ''
    }
    console.log('Data passed to GetReviews is:', params)
    await axios.post(ApiURL + 'reviews/get', params)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
        console.log(error)
    })
    return data;
  }
  ////#endregion

  export async function UploadMedia(params){
    console.log('Data passed to UploadMedia is:', params)
    let data = {
      success: false,
      data: ''
    }
    await axios.post(ApiURL + 'media', params)
    .then(function (response) {
        // handle success
        return data = {
          success: true, 
          data: response.data
        }
      })
    .catch(function(error){
        if(error.response){
          return data = {
            success: false, 
            data: error
          }
        }
        return data = {
          success: false, 
          data: error
        }
    })
    return data;
  }
//#endregion