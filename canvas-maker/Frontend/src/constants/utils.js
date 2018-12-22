//deployement config
// export const SERVER_URL="http://h2793844.stratoserver.net:5000/"
// export const FRONTEND_URL="http://h2793844.stratoserver.net/"
// export const API_URL="http://h2793844.stratoserver.net:5000/api/v1/"

// local work
// export const API_URL="http://127.0.0.1:5000/api/v1/"
// export const SERVER_URL="http://127.0.0.1:5000/"

// export const FRONTEND_URL="http://127.0.0.1:3000/"

//docker config
export const API_URL= "http://"+process.env.SERVER_URL+":5000/api/v1/";
export const SERVER_URL="http://"+process.env.SERVER_URL+":5000/"
export const FRONTEND_URL="http://"+process.env.SERVER_URL+":3000/"
