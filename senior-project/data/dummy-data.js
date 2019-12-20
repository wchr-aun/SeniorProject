import SellingTransaction from "../models/SellingTransaction";
import AllUserTrash from "../models/AllUserTrash";

export const SELLINGTRANSACTION = [
  new SellingTransaction(
    "_" +
      Math.random()
        .toString(36)
        .substr(2, 9),
    "วงศ์พานิช",
    "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/49264357_1211247719032191_6943124090672644096_n.jpg?_nc_cat=104&_nc_oc=AQmBlJycVxFSWWYBiGHaEk8OEuzkOjVQtq0_MGYGzLDe65pSnbl61krJe7s8160FMiw&_nc_ht=scontent.fbkk17-1.fna&oh=5df7779c110edc706508a621a3a252bd&oe=5E6B97FA",
    5,
    new Date(),
    "097-864-5213"
  ),
  new SellingTransaction(
    "_" +
      Math.random()
        .toString(36)
        .substr(2, 9),
    "เจตจำนง ของเก่า",
    "https://scontent.fbkk17-1.fna.fbcdn.net/v/t31.0-1/12593484_1754097161486578_5615409918936861485_o.jpg?_nc_cat=104&_nc_oc=AQka1KVSWaSlo4bNT3PCE-u56sNEk1E7Lj58vayFNexxVOytureQty_J-Ga6uTnx5Kw&_nc_ht=scontent.fbkk17-1.fna&oh=d05b8f95cf6f1a09f72fe922fe4fd9e1&oe=5E824F3E",
    5,
    new Date(),
    "097-864-5213"
  ),
  new SellingTransaction(
    "_" +
      Math.random()
        .toString(36)
        .substr(2, 9),
    "เจตจำนง ของเก่า",
    "https://scontent.fbkk17-1.fna.fbcdn.net/v/t31.0-1/12593484_1754097161486578_5615409918936861485_o.jpg?_nc_cat=104&_nc_oc=AQka1KVSWaSlo4bNT3PCE-u56sNEk1E7Lj58vayFNexxVOytureQty_J-Ga6uTnx5Kw&_nc_ht=scontent.fbkk17-1.fna&oh=d05b8f95cf6f1a09f72fe922fe4fd9e1&oe=5E824F3E",
    5,
    new Date(),
    "097-864-5213"
  ),
  new SellingTransaction(
    "_" +
      Math.random()
        .toString(36)
        .substr(2, 9),
    "เจตจำนง ของเก่า",
    "https://scontent.fbkk17-1.fna.fbcdn.net/v/t31.0-1/12593484_1754097161486578_5615409918936861485_o.jpg?_nc_cat=104&_nc_oc=AQka1KVSWaSlo4bNT3PCE-u56sNEk1E7Lj58vayFNexxVOytureQty_J-Ga6uTnx5Kw&_nc_ht=scontent.fbkk17-1.fna&oh=d05b8f95cf6f1a09f72fe922fe4fd9e1&oe=5E824F3E",
    5,
    new Date(),
    "097-864-5213"
  ),
  new SellingTransaction(
    "_" +
      Math.random()
        .toString(36)
        .substr(2, 9),
    "วงศ์พานิช",
    "https://scontent.fbkk17-1.fna.fbcdn.net/v/t1.0-9/49264357_1211247719032191_6943124090672644096_n.jpg?_nc_cat=104&_nc_oc=AQmBlJycVxFSWWYBiGHaEk8OEuzkOjVQtq0_MGYGzLDe65pSnbl61krJe7s8160FMiw&_nc_ht=scontent.fbkk17-1.fna&oh=5df7779c110edc706508a621a3a252bd&oe=5E6B97FA",
    5,
    new Date(),
    "097-864-5213"
  )
];

export default ALLUSERTRASH = [
  new AllUserTrash('u1', 'Plastic Bottle')
]